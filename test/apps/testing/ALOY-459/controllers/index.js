function setupDummyData() {
	var db = Titanium.Database.open('testdb');
  	
  	db.execute('CREATE TABLE IF NOT EXISTS DATABASETEST (ID INTEGER, NAME TEXT)');
  	db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',1,'Name 1');	
  	db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',2,'Name 2');
	db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',3,'Name 3');
	db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',4,'Name 4');
  
	var rows = db.execute('SELECT * FROM DATABASETEST');
  
	$.label1.text = "rows.filedCount is : " + typeof rows.fieldCount;
	
	rows.close();
	db.close();
}

$.index.open();
setupDummyData();
