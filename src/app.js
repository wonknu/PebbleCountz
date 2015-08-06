/**
 * Pebble Counter app
 */
var UI = require('ui');
var Vector2 = require('vector2');
var BOUNDS = { WIDTH: 144, HEIGHT: 152 };
var wind = new UI.Window();

var splashScreen = new UI.Card({ banner: 'images/splash.png' });
splashScreen.show();

var menu = new UI.Menu({
  backgroundColor: 'black',
  textColor: 'white',
  highlightBackgroundColor: 'white',
  highlightTextColor: 'black',
  sections: [{
    title: 'Menu section',
    items: [{
      title: 'Reset'
    }, {
      title: 'Restart'
    }]
  }]
});

menu.on('select', function(e) {
  menu.hide();
  wind.show();
  switch(e.itemIndex){
    case 0:
      Countz.reset();
    break;
    case 1:
      Countz.restart();
    break;
  }
});

var title = new UI.Text({
 position: new Vector2(0, 0),
 size: new Vector2(BOUNDS.WIDTH, 25),
 color: 'white',
 font: 'gothic-18-bold',
 textAlign: 'center',
 text: 'CountZ'
});

wind.add(title);

var CountzSetting = {
  number: 1,
  question1: 'Number of Players:',
  reponse1: 1,
  question2: 'Starting number:',
  reponse2: 10,
  questionText: new UI.Text({
   position: new Vector2(0, 30),
   size: new Vector2(BOUNDS.WIDTH, 25),
   color: 'white',
   font: 'gothic-18',
   textAlign: 'center',
   text: ''
  }),
  reponseText: new UI.Text({
   position: new Vector2(0, 75),
   size: new Vector2(BOUNDS.WIDTH, 100),
   color: 'white',
   font: 'bitham-42-bold',
   textAlign: 'center',
   text: ''
  }),
  hide: function(){
    wind.remove(this.questionText);
    wind.remove(this.reponseText);
  },
  display: function(index){
    if(index > 2){
      this.hide();
      return;
    }
    this.number = this['reponse' + index];
    this.questionText.text(this['question' + index]);
    this.reponseText.text(this.number);
    wind.add(this.questionText);
    wind.add(this.reponseText);
  },
  update: function(nb){
    if(this.number + nb < 1) return;
    this.number += nb;
    this.reponseText.text(this.number);
  }
};

var Player = function(options){
  this.isSelect = false;
  this.options = options;
  this.number = this.options.number;
  this.content = new UI.Text({
   position: new Vector2(this.options.x, this.options.y),
   size: new Vector2(this.options.width, this.options.height),
   color: 'white',
   font: this.options.font,
   textAlign: 'center',
   text: this.options.lineBreak + this.number
  });
};

Player.prototype.show = function(){
  wind.add(this.content);
};

Player.prototype.hide = function(){
  wind.remove(this.content);
};

Player.prototype.reset = function(){
  this.number = this.options.number;
  this.content.text(this.options.lineBreak + this.number);
};

Player.prototype.update = function(nb){
  if(this.number + nb < 0) return;
  this.number += nb;
  this.content.text(this.options.lineBreak + this.number);
};

Player.prototype.select = function(){
  this.content.backgroundColor('white');
  this.content.color('black');
};

Player.prototype.unselect = function(){
  this.content.backgroundColor('black');
  this.content.color('white');
};

var Countz = {
  step: 1,
  players: [],
  nbPlayers: 1,
  selectedPlayer: 0,
  startNumber: 1,
  
  init: function(){
    this.initListener();
    CountzSetting.display(this.step);
  },
  
  reset: function(){
    for(var i = 0; i < this.players.length; i++) this.players[i].reset();
    this.players[this.selectedPlayer].unselect();
  },
  
  restart: function(){
    for(var i = 0; i < this.players.length; i++) this.players[i].hide();
    this.selectedPlayer = 0;
    this.step =  1;
    this.players = [];
    this.nbPlayers = 1;
    this.selectedPlayer = 0;
    this.startNumber = 1;
    CountzSetting.display(this.step);
  },
  
  initListener: function(){
    
    wind.on('click', 'up', function(e) {
      if(this.step >= 3){
        this.players[this.selectedPlayer].update(1);
      }
      else CountzSetting.update(1);
    }.bind(this));
    
    wind.on('longClick', 'select', function(e) {
      if(this.step < 3) return;
      wind.hide();
      menu.show();
    }.bind(this));
    
    wind.on('click', 'select', function(e) {
      if(this.step >= 3){
        this.selectPlayer();
        return;
      }
      this.step++;
      switch(this.step){
        case 2:
          this.nbPlayers = CountzSetting.number;
        break;
        case 3:
          this.startNumber = CountzSetting.number;
          this.createPlayers();
        break;
      }
      CountzSetting.display(this.step);
    }.bind(this));
    
    wind.on('click', 'down', function(e) {
      console.log('click');
      if(this.step >= 3){
        this.players[this.selectedPlayer].update(-1);
      }
      else CountzSetting.update(-1);
    }.bind(this));
    
    wind.on('down', function(e) {
      console.log('down');
      console.log(e);
    });
    
    wind.on('longClick', 'down', function(e) {
      console.log('longClick');
    }.bind(this));
    
  },
  
  selectPlayer: function(){
    this.players[this.selectedPlayer].unselect();
    this.selectedPlayer++;
    if(this.selectedPlayer > this.players.length - 1) this.selectedPlayer = 0;
    this.players[this.selectedPlayer].select();
  },
  
  createPlayers: function(){
    var font = 'bitham-42-bold';
    var lineBreak = '';
    if(this.nbPlayers >= 7) font = 'gothic-14-bold';
    else if(this.nbPlayers >= 5) font = 'gothic-24-bold';
    else if(this.nbPlayers >= 3) lineBreak = '';
    else lineBreak = '\n';
    
    var width = BOUNDS.WIDTH * 0.5;
    var height = ((BOUNDS.HEIGHT - 25) / Math.round(this.nbPlayers * 0.5));
    for(var i = 0; i < this.nbPlayers; i++){
      var player = new Player({
        number: this.startNumber,
        index: i,
        x: (i % 2) * width,
        y: (Math.floor(i * 0.5) * height) + 25,
        width: width,
        height: height,
        font: font,
        lineBreak: lineBreak
      });
      this.players[i] = player;
      player.show();
    }
    
    this.players[this.selectedPlayer].select();
  }
  
};
setTimeout(function() {
  wind.show();
  splashScreen.hide();
}, 400);
Countz.init();
