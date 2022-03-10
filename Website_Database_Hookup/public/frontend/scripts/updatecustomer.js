var CustomerBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadCustomersFromServer: function () {

        console.log(customerid.value);

        var discountvalue = 2;
        if (custdisyes.checked){
            discountvalue = 1;
        }
        if (custdisno.checked){
            discountvalue = 0;
        }

        console.log(discountvalue);
        
        $.ajax({
            url: '/getcus',
            data: {
                'customerid': customerid.value,
                'customername': customername.value,
                'customeraddress': customeraddress.value,
                'customerzip': customerzip.value,
                'customercredit': customercredit.value,
                'customeremail': customeremail.value,
                'customerdiscount': discountvalue,
                'customerrewardtype': rewardtype.value,
            },
            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    updateSingleCustFromServer: function (customer) {
        $.ajax({
            url: '/updatesinglecust',
            dataType: 'json',
            data: customer,
            type: 'POST',
            cache: false,
            success: function (upsingledata){
                this.setState({upsingledata: upsingledata});
            }.bind(this)
        });
       // window.location.reload(true);
    },
    
    componentDidMount: function () {
        this.loadCustomersFromServer();
       // setInterval(this.loadEmployeesFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <h1>Update Customers</h1>
                <Customerform2 onCustomerSubmit={this.loadCustomersFromServer} />
                <br />
                <div id="theresults">
                    <div id="theleft">
                <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Zip</th>
                                <th></th>
                            </tr>
                         </thead>
                        <CustomerList data={this.state.data} />
                    </table>
                    </div> 
                    <div id="theright">
                        <CustomerUpdateForm onUpdateSubmit={this.updateSingleCustFromServer}/>
                    </div>
                </div>     
            </div>
        );
    }
});

var Customerform2 = React.createClass({
    getInitialState: function () {
        return {
            customerkey: "",
            customerid: "",
            customername: "",
            customeraddress: "",
            customerzip: "",
            customercredit: "",
            customeremail: "",
            customerdiscount: "",
            data: [],
        };
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    loadCustomerTypes: function () {
        $.ajax({
            url: '/getcusttypes',
            dataType: 'json',
            cache: false,
            success: function (data){
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function () {
        this.loadCustomerTypes();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var customerid = this.state.customerid.trim();
        var customeraddress = this.state.customeraddress.trim();
        var customeremail = this.state.customeremail.trim();
        var customername = this.state.customername.trim();
        var customerzip = this.state.customerzip.trim();
        var customercredit= this.state.customercredit.trim();
        var customerdiscount = this.state.selectedOption;
        var customertype = rewardtype.value;

        this.props.onCustomerSubmit({ 
            customerid: customerid, 
            customername: customername, 
            customeraddress: customeraddress, 
            customerzip: customerzip, 
            customercredit: customercredit, 
            customeremail: customeremail,
            customerdiscount: customerdiscount,
            customertype: customertype
        });
    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <div>
                <div id="theform">
            <form onSubmit={this.handleSubmit}>
                <h2>Customers</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Customer ID</th>
                            <td>
                                <input type="text" name="customerid" id="customerid" value={this.state.customerid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Name</th>
                            <td>
                                <input name= "customername" id="customername" value={this.state.customername} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Address</th>
                            <td>
                                <input name="customeraddress" id="customeraddress" value={this.state.customeraddress} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Zip</th>
                            <td>
                                <input name="customerzip" id="customerzip" value={this.state.customerzip} onChange={this.handleChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Customer Credit</th>
                            <td>
                                <input name="customercredit" id="customercredit" value={this.state.customercredit} onChange={this.handleChange} />
                            </td>
                        </tr>  
                        <tr>
                            <th>Customer Email</th>
                            <td>
                                <input name="customeremail" id="customeremail" value={this.state.customeremail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Are you a discount member?</th>
                        </tr>
                        <tr>
                        <td>
                            <input
                                type="radio"
                                name="discountvalue"
                                id="custdisyes"
                                value="1"
                                checked = {this.state.selectedOption === "1"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                                />Yes
                        </td>
                        <td>
                            <input
                                type="radio"
                                name="discountvalue"
                                id="custdisno"
                                value="0"
                                checked = {this.state.selectedOption === "0"}
                                onChange={this.handleOptionChange}
                                className="form-check-input"
                                />No
                        </td>
                        </tr>
                        <tr>
                            <th>
                                Customer Type
                            </th>
                            <td>
                                <SelectList data={this.state.data}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Customer" />
            </form>
            </div>
            <div>
                        <br/>
                        <form onSubmit={this.getInitialState}>
                            <input type="submit" value="Clear Form" />
                        </form>
            </div>
        </div>
        );
    }
});

var CustomerUpdateForm = React.createClass({
    getInitialState: function () {
        return {
            upcustomerkey: "",
            upcustomerid: "",
            upcustomername: "",
            upcustomeraddress: "",
            upcustomerzip: "",
            upcustomercredit: "",
            upcustomeremail: "",
            upcustomerdiscount: "",
            upcustomertype: "",
            upSelectedOption: "0",
            updata: [],
        };
    },

    handleUpOptionChange: function(e) {
        this.setState({
            upSelectedOption: e.target.value
        });
    },

    loadCustomerTypes: function() {
        $.ajax({
            url: 'getcusttypes',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({updata: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function() {
        this.loadCustomerTypes();
    },

    handleUpSubimt: function (e) {
        e.preventDefault();

        var upcustomerid = upcustid.value;
        var upcustomername = upcustname.value;
        var upcustomeraddress = upcustaddress.value;
        var upcustomerzip = upcustzip.value;
        var upcustomercredit = upcustcredit.value;
        var upcustomeremail = upcustemail.value;
        var upcustomerdiscount = this.state.upSelectedOption;
        var upcustomertype = upcusttype.value;
        

        this.props.onUpdateSubmit({
            upcustomerid: upcustomerid,
            upcustomername: upcustomername,
            upcustomeraddress: upcustomeraddress,
            upcustomerzip: upcustomerzip,
            upcustomercredit: upcustomercredit,
            upcustomeremail: upcustomeremail,
            upcustomerdiscount: upcustomerdiscount,
            upcustomertype: upcustomertype,
        });
    },

    handleUpChange: function(event){
        this.setState({
            [event.target.id]: event.target.value
        });
    },

    render: function() {
        return(
            <div>
                <div id="theform">
                    <form onSubmit={this.handleUpSubimt}>

                            <table>
                                <tbody>
                                    <tr>
                                        <th>Customer ID</th>
                                        <td>
                                        <input 
                                            type="text"
                                            name="upcustid"
                                            id="upcustid"
                                            value={this.state.upcustid}
                                            onchange={this.handleUpChange} />
                                        </td>    
                                    </tr>
                                    <tr>
                                        <th>Customer Name</th>
                                        <td>
                                        <input 
                                            type="text"
                                            name="upcustname"
                                            id="upcustname"
                                            value={this.state.upcustname}
                                            onchange={this.handleUpChange} />
                                        </td>    
                                    </tr>
                                    <tr>
                                        <th>Customer Address</th>
                                        <td>
                                        <input 
                                            type="text"
                                            name="upcustaddress"
                                            id="upcustaddress"
                                            value={this.state.upcustaddress}
                                            onchange={this.handleUpChange} />
                                        </td>    
                                    </tr>
                                    <tr>
                                        <th>Customer Zip</th>
                                        <td>
                                        <input 
                                            type="text"
                                            name="upcustzip"
                                            id="upcustzip"
                                            value={this.state.upcustzip}
                                            onchange={this.handleUpChange} />
                                        </td>    
                                    </tr>
                                    <tr>
                                        <th>Customer Credit</th>
                                        <td>
                                        <input 
                                            type="text"
                                            name="upcustcredit"
                                            id="upcustcredit"
                                            value={this.state.upcustcredit}
                                            onchange={this.handleUpChange} />
                                        </td>    
                                    </tr>
                                    <tr>
                                        <th>Customer Email</th>
                                        <td>
                                        <input 
                                            type="text"
                                            name="upcustemail"
                                            id="upcustemail"
                                            value={this.state.upcustemail}
                                            onchange={this.handleUpChange} />
                                        </td>    
                                    </tr>
                                    <tr>

                                        <th>
                                            Rewards Customer
                                        </th>
                                        <td>
                                            <input
                                                type="radio"
                                                name="upcustdiscount"
                                                id="upcustdisyes"
                                                value="1"
                                                checked={this.state.upSelectedOption === "1"}
                                                onChange={this.handleUpOptionChange}
                                                className="form-check-input"
                                                    /> Yes
                                                <input
                                                type="radio"
                                                name="upcustdiscount"
                                                id="upcustdisno"
                                                value="0"
                                                checked={this.state.upSelectedOption === "0"}
                                                onChange={this.handleUpOptionChange}
                                                className="form-check-input"
                                                    /> No
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Cutomer Reward Type</th>
                                        <td>
                                            <SelectUpdateList data={this.state.updata} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <br/>
                            <input type="hidden" name="upcustid" id="upcustid" onchange={this.handleUpChange} />
                            <input type="submit" value="Update Employee" />
                    </form>
                </div>
            </div>
        )
    }
})

var CustomerList = React.createClass({
    render: function () {
        var customerNodes = this.props.data.map(function (customer) {
            //map the data to individual donations
            return (
                <Customer
                    key={customer.dbcustomerid}
                    cusid={customer.dbcustomerid}
                    cusname={customer.dbcustomername}
                    cusaddress = {customer.dbcustomeraddress}
                    cuszip = {customer.dbcustomerzip}
                >
                </Customer>
            );                
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {customerNodes}
            </tbody>
        );
    }
});



var Customer = React.createClass({
    getInitialState: function() {
        return {
            upcustid: "",
            singledata: []
        };
    },

    updateRecord: function (e) {
        e.preventDefault();
        var theupcustid = this.props.cusid;

        this.loadSingleCus(theupcustid);
    },

    loadSingleCus: function (theupcustid) {
        $.ajax({
            url: 'getsinglecust',
            data: {
                'upcustid': theupcustid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({singledata: data});
                console.log(this.state.singledata);
                var populateCust = this.state.singledata.map(function (customer){
                    upcustid.value = theupcustid;
                    upcustname.value = customer.dbcustomername;
                    upcustid.value = customer.dbcustomerid;
                    upcustaddress.value = customer.dbcustomeraddress;
                    upcustzip.value = customer.dbcustomerzip;
                    upcustemail.value = customer.dbcustomeremail;
                    upcustcredit.value = customer.dbcustomercredit;
                    if (customer.dbcustomerstatus == 1) {
                        upcustdisyes.checked = true;
                    }else {
                        upcustdisno.checked = true;
                    }
                    upcusttype.value = customer.dbcustomertype
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        
        if (this.props.cusdiscount == 1){
            var cusdis = "YES";
        }
        else {
            var cusdis = "NO";
        }

        return (

            <tr>
                            <td>
                                {this.props.cusid} 
                            </td>
                            <td>
                                {this.props.cusname}
                            </td>
                            <td>
                                {this.props.cusaddress}
                            </td>
                            <td>
                                {this.props.cuszip}
                            </td>
                            <td>
                                <form onSubmit={this.updateRecord}>
                                    <input type="submit" value="Update Record" />
                                </form>
                            </td>
                </tr>
        );
    }
});

var SelectList = React.createClass({
    render: function() {
        var optionNodes = this.props.data.map(function (custTypes){
            return(
                <option
                    key={custTypes.dbcustrewardid}
                    value={custTypes.dbcustrewardid}
                    >
                        {custTypes.dbcustrewardname}
                    </option>

            );
        });
        return (
            <select name="rewardtype" id="rewardtype">
                <option value = "0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateList = React.createClass({
    render: function() {
        var optionNodes = this.props.data.map(function (custTypes){
            return(
                <option
                    key={custTypes.dbcustrewardid}
                    value={custTypes.dbcustrewardid}
                    >
                        {custTypes.dbcustrewardname}
                    </option>

            );
        });
        return (
            <select name="upcusttype" id="upcusttype">
                <option value = "0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <CustomerBox/>,
    document.getElementById('content'));