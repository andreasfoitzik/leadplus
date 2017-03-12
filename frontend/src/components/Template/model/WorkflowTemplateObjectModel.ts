class WorkflowTemplateObject {
    id: number;
    orderPositions: Array<OrderPosition>;
    customer: Customer;
    timestamp: any;
    vendor: any;
    deliveryDate: any;
    saleTurnover: number;
    saleProfit: number;
    saleCost: number;
    deliveryCosts: number;
    invoiceNumber: string;
    message: string;
    netPrice: number;
    vat: number;
    deliveryAddressLine: string;
    deliveryTerm: string;
    paymentTerm: string;
    skonto: number;
    deliveryAddress: Address;
    billingAddress: Address;

    constructor() {
        this.id = 0;
        let p = new Product();
        p.id = 0;
        p.name = "Product 1";
        p.netPrice = 500;
        p.productNumber = "A12345";
        p.productState = ProductState.NEW;
        p.timestamp = "01.01.1900 00:00:00:000";
        p.deactivated = false;
        p.description = "Product one";
        let p2 = new Product();
        p2.id = 0;
        p2.name = "Product 2";
        p2.netPrice = 800;
        p2.productNumber = "A12346";
        p2.productState = ProductState.NEW;
        p2.timestamp = "01.01.1900 00:00:00:000";
        p2.deactivated = false;
        p2.description = "Product two";
        let op = new OrderPosition();
        op.id = 0;
        op.amount = 2;
        op.discount = 0;
        op.netPrice = 500;
        op.product = p;
        let op2 = new OrderPosition();
        op2.id = 0;
        op2.amount = 1;
        op2.discount = 0;
        op2.netPrice = 800;
        op2.product = p2;
        this.orderPositions = [op, op2];
        let c = new Customer();
        c.id = 0;
        c.billingAddress.number = "48";
        c.billingAddress.street = "Boston st.";
        c.billingAddress.country = "United States";
        c.billingAddress.zip = "289374";
        c.billingAddress.state = "Seattle";
        c.billingAddress.city = "Boston";
        c.deliveryAddress.number = "22";
        c.deliveryAddress.street = "Times Square";
        c.deliveryAddress.country = "United States";
        c.deliveryAddress.zip = "10036";
        c.deliveryAddress.state = "New York";
        c.deliveryAddress.city = "New York City";
        c.company = "The Company";
        c.customerNumber = "C12345";
        c.deactivated = false;
        c.email = "john@smith.de";
        c.firstname = "John";
        c.lastname = "Smith";
        c.phone = "0893458934234";
        c.fax = "1111111";
        c.mobile = "22222";
        c.realCustomer = true;
        c.timestamp = "01.01.1900 00:00:00:000";
        c.title = "MR";
        this.customer = c;
        this.timestamp = "01.01.1900  00:00:00:000";
        this.vendor = null;
        this.deliveryAddressLine = "New York";
        this.deliveryDate = "01.01.2017";
        this.saleProfit = 0;
        this.saleCost = 0;
        this.deliveryCosts = 120;
        this.invoiceNumber = "I12345";
        this.message = "This is a test message";
        this.netPrice = 1920;
        this.vat = 19;
        this.skonto = 3;
        this.paymentTerm = "Please pay the full amount within 30 days; Payments made within 10 days are eligible for a discount.";
        this.deliveryTerm = "Free";
        this.billingAddress = new Address();
        this.billingAddress.number = "48";
        this.billingAddress.street = "Boston st.";
        this.billingAddress.country = "United States";
        this.billingAddress.zip = "289374";
        this.billingAddress.state = "Seattle";
        this.billingAddress.city = "Boston";
        this.deliveryAddress = new Address();
        this.deliveryAddress.number = "48";
        this.deliveryAddress.street = "Boston st.";
        this.deliveryAddress.country = "United States";
        this.deliveryAddress.zip = "289374";
        this.deliveryAddress.state = "Seattle";
        this.deliveryAddress.city = "Boston";
    }
}