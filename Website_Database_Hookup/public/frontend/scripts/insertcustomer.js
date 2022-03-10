var CustomerBox = React.createClass({
    handleCustomerSubmit: function (customer) {

        $.ajax({
            url: '/customer',
            datatype: 'json',
            type: 'POST',
            data: customer,
            success: function (data){
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div className="CustomerBox">
                <h1>Customers</h1>
                <Customerform2 onCustomerSubmit={this.handleCustomerSubmit}/>
            </div>
        );
    }
});

var Customerform2 = React.createClass({
    getInitialState: function () {
        return {
            customername: "",
            customeraddress: "",
            customerzip: "",
            customecredit: "",
            customeremail: "",
            customerpw: "",
            customerpw2: "",
            customerdiscount: "",
            data: [],
        }
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    loadCustomerTypes: function () {
        $.ajax({
            url: '/getcusttypes/',
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

    handleSubmit: function (e){

        e.preventDefault();

        var customername = this.state.customername.trim();
        var customeraddress = this.state.customeraddress.trim();
        var customerzip = this.state.customerzip.trim();
        var customercredit = this.state.customercredit;
        var customeremail = this.state.customeremail.trim();
        var customerpw = this.state.customerpw.trim();
        var customerpw2 = this.state.customerpw2.trim();
        var customerdiscount = this.state.selectedOption;
        var customertype = rewardtype.value;

        console.log("PW: " + customerpw);

        if (customerpw != customerpw2){
            alert("Passwords do not match!");
            return
        }
        if (!this.validateEmail(customeremail)) {
            console.log("Bad Email " + this.validateEmail(customeremail));
            return;
        }
        if (isNaN(customercredit)) {
            console.log("Not a number" + customercredit);
            return;
        }
        if (!customername || !customeremail || !customercredit){
            console.log("field Missing!");
            return;
        }

        this.props.onCustomerSubmit({
            customername: customername,
            customeraddress: customeraddress,
            customerzip: customerzip,
            customercredit: customercredit,
            customeremail: customeremail,
            customerdiscount: customerdiscount,
            customertype: customertype,
            customerpw: customerpw
        });
    },

    validateEmail: function (value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },
    validateDollars: function (value) {
        var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return regex.test(value);
    },
    commonValidate: function () {
        return true;
    },
    setValue: function (field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },
    render: function () {

        return (
            <form className="customerForm" onSubmit={this.handleSubmit}>
                <h2>Customers</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Customer Name</th>
                            <td>
                <TextInput
                    value={this.state.customername}
                    uniqueName="customername"
                    textArea={false}
                    required={true}
                    minCharacters={6}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'customername')}
                    errorMessage="Customer Name is invalid"
                    emptyMessage="Customer Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Address</th>
                            <td>
                <TextInput
                    value={this.state.customeraddress}
                    uniqueName="customeraddress"
                    textArea={false}
                    required={false}
                    minCharacters={6}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'customeraddress')}
                    errorMessage="Customer Address is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Zip</th>
                            <td>

                <TextInput
                    value={this.state.customerzip}
                    uniqueName="customerzip"
                    textArea={false}
                    required={false}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'customerzip')}
                    errorMessage=""
                    emptyMessage="" />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Credit Limit</th>
                            <td>

                <TextInput
                    value={this.state.customercredit}
                    uniqueName="customercredit"
                    textArea={false}
                    required={false}
                    validate={this.validateDollars}
                    onChange={this.setValue.bind(this, 'customercredit')}
                    errorMessage="Did not enter a dollar value"
                    emptyMessage="" />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer E-Mail</th>
                            <td>
              

                <TextInput
                    value={this.state.customeremail}
                    uniqueName="customeremail"
                    textArea={false}
                    required={true}
                    validate={this.validateEmail}
                    onChange={this.setValue.bind(this, 'customeremail')}
                    errorMessage="Invalid E-Mail Address"
                    emptyMessage="E-Mail Address is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.customerpw}
                                    uniqueName="customerpw"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'customerpw')}
                                    errorMessage="Invlid Password" 
                                    emptyMessage="Password is required"/>
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Password Confirm</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.customerpw2}
                                    uniqueName="customerpw2"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'customerpw2')}
                                    errorMessage="Invlid Password" 
                                    emptyMessage="Password is required"/>
                            </td>
                        </tr>
                        <tr><th>Join our Discount services?</th></tr>
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
            <input type="submit" value="Insert Customer" />
               
            </form>
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
                {optionNodes}
            </select>
        );
    }
});

var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
                <td> {this.props.errorMessage} </td>
        )
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        type={this.props.inputType}
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

ReactDOM.render(
    <CustomerBox />,
    document.getElementById('content')
);
