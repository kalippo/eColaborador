// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

if (Ti.Contacts.hasContactsPermissions()) {
    leerContactos();
} else {
    Ti.Contacts.requestContactsPermissions(function(e) {
        if (e.success) {
            	leerContactos();
			
        } else {
           Ti.API.info('no authorization');
        }
    });
}


function leerContactos()
{
	 var singleValue = [
		  'recordId', 'firstName', 'middleName', 'lastName', 'fullName', 'prefix', 'suffix', 
		  'nickname', 'firstPhonetic', 'middlePhonetic', 'lastPhonetic', 'organization', 
		  'jobTitle', 'department', 'note', 'birthday', 'created', 'modified', 'kind'
	];
	var multiValue = [
	  'email', 'address', 'phone', 'instantMessage', 'relatedNames', 'date', 'url'
	];
	var people = Ti.Contacts.getAllPeople();
	Ti.API.info('Total contacts: ' + people.length);
	for (var i=0, ilen=people.length; i<ilen; i++){
	  Ti.API.info('---------------------');
	  var person = people[i];
	  for (var j=0, jlen=singleValue.length; j<jlen; j++){
	    Ti.API.info(singleValue[j] + ': ' + person[singleValue[j]]);
	  }
	  for (var j=0, jlen=multiValue.length; j<jlen; j++){
	    Ti.API.info(multiValue[j] + ': ' + JSON.stringify(person[multiValue[j]]));
	  }
  }
}