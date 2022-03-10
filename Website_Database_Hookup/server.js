'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');

const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "hsmith24",
    password: "Chargers24!",
    database: "hsmith24_TutorMgmtTues",
});

con.connect(function (err){
    if (err) throw err;
    console.log("Connected!");
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
    res.sendFile(path.join(__dirname + '/public/backend/index.html'));
});

app.post('/loginemp/', function(req, res){

    var eemail = req.body.employeeemail;
    var epw = req.body.employeepw;

    var sqlsel = 'select * from employeetable where dbemployeeemail = ?';

    var inserts = [eemail];
    var sql = mysql.format(sqlsel, inserts);
    console.log("sql: " + sql);
    con.query(sql, function (err, data){
        if (data.length > 0) {
            console.log("User Name Correct:");
            console.log(data[0].dbemployeepassword);
            bcrypt.compare(epw, data[0].dbemployeepassword, function (err, passwordCorrect){
                if (err) {
                    throw err
                } else if (!passwordCorrect){
                    console.log("Password incorrect")
                } else {
                    console.log("Password correct")
                    res.send({redirect: '/backend/searchemployee.html' });
                }
            })
        } else{
            console.log("Incorrect username or password");
        }
    });
});

app.post('/logincust/', function(req, res){

    var custemail = req.body.customeremail;
    var custpw = req.body.customerpw;

    var sqlsel = 'select * from customertable where dbcustomeremail = ?';

    var inserts = [custemail];
    var sql = mysql.format(sqlsel, inserts);
    console.log("sql: " + sql);
    con.query(sql, function (err, data){
        if (data.length > 0) {
            console.log("User Name Correct:");
            console.log(data[0].dbcustomerpassword);
            bcrypt.compare(custpw, data[0].dbcustomerpassword, function (err, passwordCorrect){
                if (err) {
                    throw err
                } else if (!passwordCorrect){
                    console.log("Password incorrect")
                } else {
                    console.log("Password correct")
                    res.send({redirect: '/frontend/searchcustomer.html' });
                }
            })
        } else{
            console.log("Incorrect username or password");
        }
    });
});

app.get('/getcusttypes/', function (req, res){
    var sqlsel = 'SELECT * FROM customerrewards';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getemptypes/', function (req, res) {

    var sqlsel = 'SELECT * FROM employeetypes';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err,data) {
        if (err){
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsingleemp/', function (req, res){
    var ekey = req.query.upempkey

    var sqlsel = 'select * from employeetable where dbemployeekey = ?';
    var inserts = [ekey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getsinglecust/', function (req, res){
    var cuskey = req.query.upcustid

    var sqlsel = 'select * from customertable where dbcustomerid = ?';
    var inserts = [cuskey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleemp/', function (req, res, ){
    var eid = req.body.upemployeeid;
    var ename = req.body.upemployeename;
    var ephone = req.body.upemployeephone
    var eemail = req.body.upemployeeemail;
    var esalary = req.body.upemployeesalary;
    var emailer = req.body.upemployeemailer;
    var etype = req.body.upemployeetype;
    var ekey = req.body.upemployeekey;

    var sqlins = "UPDATE employeetable SET dbemployeeid = ?, dbemployeename = ?, dbemployeeemail = ?, " +
        "dbemployeephone = ?, dbemployeesalary = ?, dbemployeemailer = ?, dbemployeetype = ? " +
        "WHERE dbemployeekey = ? ";
    var inserts = [eid, ename, eemail, ephone, esalary, emailer, etype, ekey];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql,function (err, result){
        console.log("1 record updated");
        res.end();
    });
});

app.post('/updatesinglecust/', function (req, res, ){
    var cusid = req.body.upcustomerid;
    var cusname = req.body.upcustomername;
    var cusaddress = req.body.upcustomeraddress;
    var cuszip = req.body.upcustomerzip;
    var cuscredit = req.body.upcustomercredit;
    var cusemail = req.body.upcustomeremail;
    var cusdiscount = req.body.upcustomerdiscount;
    var custype = req.body.upcustomertype;

    var sqlins = "UPDATE customertable SET dbcustomername = ?, dbcustomeraddress = ?, dbcustomerzip = ?, " +
        "dbcustomercredit = ?, dbcustomeremail = ?, dbcustomerstatus = ?, dbcustomertype = ? " +
        "WHERE dbcustomerid = ? ";
    var inserts = [cusname, cusaddress, cuszip, cuscredit, cusemail, cusdiscount, custype, cusid];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result){
        console.log("1 record Updated");
        res.end();
    });

}),

app.get('/getemp/', function (req, res) {
    var eid = req.query.employeeid;
    var ename = req.query.employeename;
    var ephone = req.query.employeephone
    var eemail = req.query.employeeemail;
    var esalary = req.query.employeesalary;
    var emailer = req.query.employeemailer;
    var etype = req.query.employeetype;

    console.log("Mailer: " + emailer);
    console.log("Type: " + etype);

    if (emailer == 1 || emailer == 0){
        var maileraddon = ' and dbemployeemailer = ?';
        var maileraddonvar = emailer;
    } else {
        var maileraddon = ' and dbemployeemailer Like ?';
        var maileraddonvar = '%%';
    }

    if (etype > 0) {
        var typeaddon = ' and dbemployeetype = ?';
        var typeaddonvar = etype;
    } else {
        var typeaddon = ' and dbemployeetype Like ?';
        var typeaddonvar = '%%';
    }

    var sqlsel = 'Select employeetable.*, employeetypes.dbemptypename from employeetable inner join employeetypes on employeetypes.dbemptypeid = employeetable.dbemployeetype where dbemployeeid Like ? and dbemployeename Like ? and dbemployeephone Like ? and dbemployeeemail Like ? and dbemployeesalary Like ?' + maileraddon + typeaddon;
    var inserts = ['%' + eid + '%', '%' + ename + '%', '%' + ephone + '%', '%' + eemail + '%', '%' + esalary + '%', maileraddonvar, typeaddonvar];
    
    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err,data) {
        if (err){
            console.log("Error!");
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getcus/', function (req, res){
    var cusid = req.query.customerid;
    var cusname = req.query.customername;
    var cusaddress = req.query.customeraddress;
    var cuszip = req.query.customerzip;
    var cuscredit = req.query.customercredit;
    var cusemail = req.query.customeremail;
    var cusdiscount = req.query.customerdiscount;
    var custype = req.query.customerrewardtype;

    console.log("Discount: " + cusdiscount);
    console.log("Type: " + custype);

    if (cusdiscount == 1 || cusdiscount == 0) {
        var discountaddon = ' and dbcustomerstatus = ?';
        var discountaddonvar = cusdiscount;
    }else {
        var discountaddon = ' and dbcustomerstatus Like ?';
        var discountaddonvar = '%%';
    }

    if (custype > 0) {
        var typeaddon = ' and dbcustomertype = ?';
        var typeaddonvar = custype;
    } else {
        var typeaddon = ' and dbcustomertype Like ?';
        var typeaddonvar = '%%';
    }

    var sqlsel = 'Select customertable.*, customerrewards.dbcustrewardname from customertable inner join customerrewards on customerrewards.dbcustrewardid = customertable.dbcustomertype where dbcustomerid Like ? and dbcustomername Like ? and dbcustomeraddress Like ? and dbcustomerzip Like ? and dbcustomercredit Like ? and dbcustomeremail Like ?' + discountaddon + typeaddon; 
    var inserts = ['%' + cusid + '%', '%' + cusname + '%', '%' + cusaddress + '%', '%' + cuszip + '%', '%' + cuscredit + '%', '%' + cusemail + '%', discountaddonvar, typeaddonvar];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err,data) {
        if (err){
            console.log("Error!");
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});


app.post('/customer', function (req, res, ){

    var cname = req.body.customername;
    var caddress = req.body.customeraddress;
    var czip = req.body.customerzip;
    var ccredit = req.body.customercredit;
    var cemail = req.body.customeremail;
    var cpw = req.body.customerpw;
    var cdiscount = req.body.customerdiscount;
    var ctype = req.body.customertype;

    console.log(cname);
    console.log('PW' + cpw)

    var saltRounds = 10;
    var theHashedPW = '';
    bcrypt.hash(cpw, saltRounds, function (err, hashedPassword){
        if (err) {
            console.log("Bad");
            return
        } 
        else {
            theHashedPW = hashedPassword;
            console.log("Password 1: " + theHashedPW);

        var sqlins = "INSERT INTO customertable (dbcustomername, dbcustomeraddress, dbcustomerzip,"
           + " dbcustomercredit, dbcustomeremail, dbcustomerstatus, dbcustomertype, dbcustomerpassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        var inserts = [cname, caddress, czip, ccredit, cemail, cdiscount, ctype, theHashedPW];

        var sql = mysql.format(sqlins, inserts);

        con.execute(sql, function (err,result){
            if (err) throw err;
            console.log("1 record inserted");
            res.redirect('insertcustomer.html');
            res.end();
            });
        }
    });
});

app.post('/employee', function (req, res, ){

    var eid = req.body.employeeid;
    var ename = req.body.employeename;
    var eemail = req.body.employeeemail;
    var epw = req.body.employeepw;
    var ephone = req.body.employeephone;
    var esalary = req.body.employeesalary;
    var emailer = req.body.employeemailer;
    var etype = req.body.employeetype;
    
    console.log(ename);
    console.log('pw' + epw);

    var saltRounds = 10;
    var theHashedPW = '';
    bcrypt.hash(epw, saltRounds, function (err, hashedPassword){
        if (err) {
            console.log("Bad");
            return
        } 
        else {
            theHashedPW = hashedPassword;
            console.log("Password 1: " + theHashedPW);
    
        var sqlins = "INSERT INTO employeetable ( dbemployeeid, dbemployeename, dbemployeeemail, dbemployeephone, dbemployeesalary, dbemployeemailer, dbemployeetype, dbemployeepassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        var inserts = [eid, ename, eemail, ephone, esalary, emailer, etype, theHashedPW];

        var sql = mysql.format(sqlins, inserts);

        con.execute(sql, function (err,result){
            if (err) throw err;
            console.log("1 record inserted");
            res.redirect('insertemployee.html');
            res.end();
            });
        }       
    });
});

app.get('/getemps', function (req, res) {

    var sqlsel = 'select * from employeetable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if(err){
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getcusts', function (req, res) {

    var sqlsel = 'select * from customertable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if(err){
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/Cart/', function (req, res) {
    var cartemp = req.body.CartEmp;

    var sqlsel = 'select MAX(dbcartdailyid) as daymax from cartinfo ' 
    + ' WHERE DATE(dbcartdate) = CURDATE()';

    var sql = format.mysql(sqlsel);

    var dailynumber = 1
    
    con.query(sql, function (err, data){
        console.log(data[0].daymax);

        if (!data[0].daymax){
            dailynumber = 1;
        }else{
            dailynumber = data[0].daymax + 1;
        }

        var sqlinscart = "INSERT INTO cartinfo (dbcartemp, dbcartdailyid, "
            + " dbcartpickup, dbcartmade, dbcartdate) VALUES (?,?,?,?,now())";
        
        var insertcart = [cartemp, dailynumber, 0, 0];
        var sqlcart = mysql.format(sqlinscart, insertcart);

        con.execute(sqlcart, function (err, result){
            if(err) throw err;
            console.log("1 recod inserted");
            res.redirect('insertcart.html');
            res.end();
        });

    });
});

app.get('/getcart/', function (req, res){
    var empid = req.query.employeeid;

    var sqlsel = 'Select cartinfo.*, employeetable.dbemployeename from cartinfo' +
        ' inner join employeetable on employeetable.dbemployeekey = cartinfo.dbcartemp' +
        ' where dbcartemp = ?';

    var inserts = [empid];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err,data){
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});


app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
