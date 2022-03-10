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
            url: '/getcus/',
            data: {
                'customerid': customerid.value,
                'customername': customername.value,
                'customeraddress': customeraddress.value,
                'customerzip': customerzip.value,
                'customercredit': customercredit.value,
                'customeremail': customeremail.value,
                'customerdiscount': discountvalue.value,
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
    
    componentDidMount: function () {
        this.loadCustomersFromServer();
       // setInterval(this.loadEmployeesFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <h1>Customers</h1>
                <Customerform2 onCustomerSubmit={this.loadCustomersFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Zip</th>
                                <th>Credit</th>
                                <th>Email</th>
                                <th>Discount Customer</th>
                                <th>Reward Type</th>
                            </tr>
                         </thead>
                        <CustomerList data={this.state.data} />
                    </table>      
            </div>
        );
    }
});

var Customerform2 = React.createClass({
    getInitialState: function () {
        return {
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
        );
    }
});

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
                    cuscredit = {customer.dbcustomercredit}
                    cusemail={customer.dbcustomeremail}
                    cusdiscount = {customer.dbcustomerstatus}
                    rewardtype = {customer.dbcustrewardname}
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
                                {this.props.cuscredit}
                            </td>
                            <td>
                                {this.props.cusemail}
                            </td>
                            <td>
                                {cusdis}
                            </td>
                            <td>
                                {this.props.rewardtype}
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


ReactDOM.render(
    <CustomerBox/>,
    document.getElementById('content'));