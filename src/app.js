/**
 * App by: Stanley Altfeld
 *
 * This app displays a random name from a list of names provided by the user.  
 * It can do with with or without removal
 */


var UI = require('ui');
var Vector2 = require('vector2');
var storageKey = 0; //Key for local storage


var namelist; //stores the list of names
var removalnamelist; //Name list used in random name + remove feature
var random = 0; //below stores random

//If first time useing populates namelist with a generic list. Otherwise gets the list from storage
if (localStorage.getItem(storageKey) !== null)
    {
      removalnamelist = stringToArray(localStorage.getItem(storageKey));
      namelist = stringToArray(localStorage.getItem(storageKey));
    }
else 
    {
      namelist = stringToArray('Adam Smith,Jackie Jackson,Morgan Bean,Eve Newton,Issac Jones');
      removalnamelist = stringToArray('Adam Smith,Jackie Jackson,Morgan Bean,Eve Newton,Issac Jones');  
    }

//Main UI page
var main = new UI.Card({
  title: 'Random Name',
  style: 'small',
  body: 'Press select for random name, Up for name with removal, or down to reset the removal list'
});
main.show();

main.on('click', 'select', function(e){

  random = Math.floor(Math.random()*namelist.length); //Gets a random number for showing a random name
 
  //creates a new window for displaying the random name
  var wind = new UI.Window({
    fullscreen: true,
  });
  
  //Text element for displaying the name
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: namelist[random],
    textAlign: 'center'
  });
  wind.add(textfield); //add the text to the window
  wind.show(); 
  //When the select button is pressed displays a new name
  wind.on('click', 'select', function(e){
    random = Math.floor(Math.random()*namelist.length);
    textfield.text(namelist[random]);
  }); 
});

//Upon clicking up will pick random names and then remove the
//selected name from an array so they will not be chosen again
main.on('click', 'up', function(e){
  random = Math.floor(Math.random()*removalnamelist.length); //Gets a random number for showing a random name
  
  //creates a new window for displaying the random name
  var wind = new UI.Window({
    fullscreen: true,
  });
  
  //Text element for displaying the name
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: removalnamelist[random],
    textAlign: 'center'
  });
  if(removalnamelist.length === 0){textfield.text('The list is empty.');}
  wind.add(textfield); //add the text to the window
  wind.show();
  removalnamelist.splice(random,1); //removes the picked name from the list\
  //When the up button is pressed displays a new name
  wind.on('click', 'up', function(e){
    random = Math.floor(Math.random()*removalnamelist.length);
    textfield.text(removalnamelist[random]);
    if(removalnamelist.length === 0){textfield.text('The list is empty.');}
    removalnamelist.splice(random,1);
  });   
});

//Upon pressing down resets the removal name list from the stored list
//CONCERN: accessing storage is slow, should write a function that copies an array
main.on('click', 'down', function(e){
  removalnamelist = stringToArray(localStorage.getItem(storageKey));
});

//Shows the config page and sends the current name list to it
Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL('http://www.wtnfs.org/settings.html?names=,' + arrayToString(namelist));
});

//When the config page is closed takes the provided name list from the returned value, 
//repopulates namelist with it, and stores it in local storage 
Pebble.addEventListener('webviewclosed',
  function(e) {
    var configuration = JSON.parse(decodeURIComponent(e.response));
    var names = JSON.stringify(configuration);
    namelist = stringToArraySplice(names);
    localStorage.setItem(storageKey, arrayToString(namelist));
    console.log('Configuration window returned: ', JSON.stringify(configuration));
  }
);

//converts a string into an array where the string has individual elements seperated by ,
function stringToArray(stringA)
{
  var array = stringA.split(",");
  return array;
}

//Same as above but used in a fringe case to remove junk data that is returned from the config page
function stringToArraySplice(stringA)
{
  var array = stringA.split(",");
  array.splice(0,1);
  array.splice(array.length-1,1);
  return array;
}

//Converts an array into a string(and convenitly sperates elements with commas)
function arrayToString(arrayA)
{
  var string = arrayA.toString();
  return string;
}
