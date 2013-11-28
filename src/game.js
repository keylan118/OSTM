$(document).ready(function() {
	$('.particles').html(ParticleContainer.getHtml());

	Game.init();

	//TODO: create helper class that 1: adds these events , 2: creates size-x css as needed
	/*$('.health-button').click(function() {
		Player.healthPlusClicked();
	}).mouseleave(function() { $(this).attr('class', 'health-button'); })
	.mouseup(function() { $(this).attr('class', 'health-button size-1_1'); })
	.mouseenter(function() { $(this).attr('class', 'health-button size-1_1'); })
	.mousedown(function() { $(this).attr('class', 'health-button size-0_85'); });*/
});

var Game = {
	toSave: ['Player', 'Inventory', 'AdventureScreen', 'Save',
		'Village', 'Blacksmith', 'Skills'],

	realtimeDt: 33,
	normalDt: 100,
	veryLongDt: 30000,

	dT: 100,

	init: function() {
		Log.init();

		Menu.init();
		EnemyManager.init();

		Inventory.init();
		Village.init();
		Blacksmith.init();
		Skills.init();

		Player.init();

		Save.load();

		window.setInterval(Game.update, Game.normalDt);
		window.setInterval(Game.veryLongUpdate, Game.veryLongDt);
		Game.update();

		// Report current version
		ga('set', 'dimension1', Save.currentSaveVersion);
	},

	update: function() {
		var prevTime = Date.now();
		return function() {
			Game.dT = (Date.now() - prevTime) / 1000;

			Player.update();
			Inventory.update();
			Village.update();
			Blacksmith.update();
			Skills.update();

			Menu.update();
			AdventureScreen.update();

			Save.update();

			prevTime = Date.now();
		};
	}(),

	veryLongUpdate: function() {
		// Check for updates
		$.getJSON('update.json', function(data) {
			if (data && data.version && Save.isNewerVersion(data.version, Save.currentSaveVersion)) {
				var str = '<h4>New Update! - ' + data.version + '</h4><i>' +
					data.description + '</i><ul>';
				for (var i = 0; i < data.changes.length; i++) {
					str += '<li>' + data.changes[i] + '</li>';
				}
				str += '</ul>';
				j('.update', 'toggle', true);
				j('.update', 'html', str);
			}
		});

		// Report player level
		ga('set', 'dimension2', Player.getLevel());
	},
};
