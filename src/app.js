/**
 * Counter app
 */
var UI = require('ui');
var Vector2 = require('vector2');

var counter = 0;
var startCounter = 0;
var currentScreen = 0;

var title = new UI.Text({
 position: new Vector2(0, 0),
 size: new Vector2(144, 168),
 color: 'white',
 font: 'gothic-28-Bold',
 textAlign: 'center',
 text: 'CountZ'
});

var hint = new UI.Text({
 position: new Vector2(0, 35),
 size: new Vector2(144, 168),
 color: 'white',
 font: 'gothic-18',
 text: 'Select number',
 textAlign: 'center'
});

var output = new UI.Text({
 position: new Vector2(0, 75),
 size: new Vector2(144, 168),
 color: 'white',
 font: 'bitham-42-bold',
 text: '0',
 textAlign: 'center'
});

var wind = new UI.Window();
wind.add(title);
wind.add(hint);
wind.add(output);
wind.show();

var setDangerColor = function (){
  if(counter <= startCounter * 0.25) output.color('red');
  else if(counter <= startCounter * 0.5) output.color('orange');
  else output.color('white');
};

wind.on('click', 'up', function(e) {
  output.text((counter++).toString());
  if(currentScreen === 1) setDangerColor();
});

wind.on('click', 'select', function(e) {
  if(currentScreen === 2){
    currentScreen = 0;
    output.color('white');
    hint.text('Start number');
    return;
  }
  if(currentScreen === 1){
    output.color('white');
    counter = startCounter;
    output.text(counter.toString());
    hint.text('');
  }
  if(currentScreen === 0 && counter > 0){
    output.color('white');
    currentScreen = 1;
    startCounter = counter;
    hint.text('');
  }
});

wind.on('click', 'down', function(e) {
  counter = (counter - 1 < 0) ? 0 : counter - 1;
  output.text(counter.toString());
  if(counter <= 0){
    hint.text('You loose');
    currentScreen = 2;
  }
  else if(currentScreen === 1) setDangerColor();
});
