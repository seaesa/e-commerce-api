import bcrypt from 'bcrypt';
// import { faker } from '@faker-js/faker';

export async function up (db, client) {
    // Create a company
    let company = {
        name: 'Example Company',
        email: 'company1@example.com',
        phone: '9087654321',
        website: 'company1.com',
        address: '234 Southern Blvd Bronx, NY 10454',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss',
        timeZone: 'Asia/Kolkata',
        appName: 'ECOMMERCE',
        createdAt: new Date()
    };
    company = await db.collection('companies').insertOne(company);

    // find inserted company id
    const companyId = company.insertedId;

    // Create 3 brands
    const brands = [
        {
            companyId,
            name: 'Sony',
            slug: 'sony',
            status: 'active',
            createdAt: new Date()
        },
        {
            companyId,
            name: 'Samsung',
            slug: 'samsung',
            status: 'active',
            createdAt: new Date()
        },
        {
            companyId,
            name: 'Apple',
            slug: 'apple',
            status: 'active',
            createdAt: new Date()
        }
    ];
    await db.collection('brands').insertMany(brands);

    // Create 3 categories i.e. Laptop, Mobile, and Watch
    const categories = [
        {
            companyId,
            name: 'Laptop',
            slug: 'laptop',
            status: 'active',
            createdAt: new Date()
        },
        {
            companyId,
            name: 'Mobile',
            slug: 'mobile',
            status: 'active',
            createdAt: new Date()
        },
        {
            companyId,
            name: 'Watch',
            slug: 'watch',
            status: 'active',
            createdAt: new Date()
        }
    ];
    await db.collection('categories').insertMany(categories);

    // Create 5 subcategories for each categories
    const subcategories = [];
    for (const category of categories) {
        for (let i = 1; i <= 5; i++) {
            subcategories.push({
                companyId,
                categoryId: category._id,
                name: `${category.name} ${i}`,
                slug: `${category.slug}-${i}`,
                status: 'active',
                createdAt: new Date()
            });
        }
    }
    await db.collection('subCategories').insertMany(subcategories);

    // Create company settings
    const companySettings = {
        companyId,
        paypalStatus: false,
        paypalEnvironment: 'sandbox',
        paypalSandboxClientId: '',
        paypalSandboxClientSecret: '',
        paypalLiveClientId: '',
        paypalLiveClientSecret: '',
        stripeStatus: false,
        stripeEnvironment: 'sandbox',
        stripeSandboxPublishableKey: '',
        stripeSandboxSecretKey: '',
        stripeLivePublishableKey: '',
        stripeLiveSecretKey: '',
        razorpayStatus: true,
        razorpayEnvironment: 'sandbox',
        razorpaySandboxKeyId: 'rzp_test_qTSIU9xaKrYa3O',
        razorpaySandboxKeySecret: '3k3zCJvyvVLe5oM4wZqh5Siv',
        razorpayLiveKeyId: '',
        razorpayLiveKeySecret: ''
    };
    await db.collection('companySettings').insertOne(companySettings);

    // Create 3 coupons
    const coupons = [
        {
            companyId,
            code: 'OFF10',
            discountType: 'fixed',
            discount: 10,
            status: 'active',
            createdAt: new Date()
        },
        {
            companyId,
            code: 'OFF20',
            discountType: 'fixed',
            discount: 20,
            status: 'active',
            createdAt: new Date()
        },
        {
            companyId,
            code: 'OFF30',
            discountType: 'fixed',
            discount: 30,
            status: 'active',
            createdAt: new Date()
        }
    ];
    await db.collection('coupons').insertMany(coupons);

    // Create email settings
    const emailSettings = {
        companyId,
        mailFromName: '',
        mailFromAddress: '',
        driver: '',
        host: '',
        port: '',
        username: '',
        password: '',
        encryption: '',
        status: 'inactive',
        createdAt: new Date()
    };
    await db.collection('emailSettings').insertOne(emailSettings);

    // Create 3 languages
    const languages = [
        {
            companyId,
            name: 'English',
            code: 'en',
            status: 'active',
            createdAt: new Date()
        },
        {
            companyId,
            name: 'Hindi',
            code: 'hi',
            status: 'active',
            createdAt: new Date()
        },
        {
            companyId,
            name: 'French',
            code: 'fr',
            status: 'active',
            createdAt: new Date()
        }
    ];
    await db.collection('languages').insertMany(languages);

    // Create 5 products
    const products = [
        {
            companyId,
            name: 'Sony Vaio',
            slug: 'sony-vaio',
            brandId: brands[0]._id,
            categoryId: categories[0]._id,
            price: 1000,
            image: 'https://4.imimg.com/data4/NS/RT/MY-28174815/sony-vaio-laptop.jpg',
            images: [
                'https://www.digitaltrends.com/wp-content/uploads/2022/07/vaio-fe-14.1-featured-e1658868523911.jpg?p=1',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwjTfPYy2rbQ-bAzB1_-U4mgi6nGYC_BMg4w&usqp=CAU',
                'https://www.91-img.com/pictures/laptops/sony/sony-vpcea42eg-core-i3-1st-gen-2-gb-320-gb-windows-7-hb-61146-large-1.jpg?tr=h-330,c-at_max,q-80'
            ],
            status: 'active',
            sku: 'SONY-VAIO-001',
            tags: ['laptop', 'sony', 'vaio'],
            isNew: true,
            stock: 100,
            createdAt: new Date(),
            shortDescription: 'This is a short description',
            longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            companyId,
            name: 'Samsung Galaxy',
            slug: 'samsung-galaxy',
            brandId: brands[1]._id,
            categoryId: categories[1]._id,
            price: 2000,
            image: 'https://images.samsung.com/in/smartphones/galaxy-z-flip4/images/galaxy-z-flip4_highlights_kv.jpg',
            images: [
                'https://images.samsung.com/is/image/samsung/p6pim/in/sm-a055fzshins/gallery/in-galaxy-a05-sm-a055-480573-sm-a055fzshins-538467279?$650_519_PNG$',
                'https://images.samsung.com/is/image/samsung/p6pim/levant/feature/164018485/levant-feature-minimalist-design-with-striking-style-532030987?$FB_TYPE_B_JPG$',
                'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Samsung_Galaxy_Z_smartphone.jpg/1200px-Samsung_Galaxy_Z_smartphone.jpg',
                'https://image-us.samsung.com/us/smartphones/galaxy-s23/images/gallery/phantom-black/01-DM1-PhantomBlack-PDP-1600x1200.jpg?$default-400-jpg$'
            ],
            status: 'active',
            sku: 'SAMSUNG-GALAXY-001',
            tags: ['laptop', 'sony', 'vaio'],
            isNew: true,
            stock: 100,
            createdAt: new Date(),
            shortDescription: 'This is a short description',
            longDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam quisque id diam vel quam elementum. Tincidunt nunc pulvinar sapien et ligula ullamcorper. Purus sit amet luctus venenatis lectus magna. Orci porta non pulvinar neque laoreet suspendisse interdum consectetur libero. Nunc mattis enim ut tellus. Amet consectetur adipiscing elit duis. Viverra adipiscing at in tellus integer feugiat. Lorem ipsum dolor sit amet consectetur adipiscing. Tristique senectus et netus et malesuada fames ac turpis. Etiam erat velit scelerisque in.

            Sed felis eget velit aliquet. Duis ultricies lacus sed turpis tincidunt. Tempor orci dapibus ultrices in iaculis nunc. Purus in massa tempor nec. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Vitae justo eget magna fermentum. Purus sit amet volutpat consequat mauris. Lacinia at quis risus sed vulputate odio ut. Euismod in pellentesque massa placerat duis ultricies lacus sed. Fringilla ut morbi tincidunt augue interdum velit. Mattis molestie a iaculis at. Lectus quam id leo in vitae turpis. Egestas quis ipsum suspendisse ultrices gravida dictum. Aliquet eget sit amet tellus cras adipiscing enim eu turpis.`
        },
        {
            companyId,
            name: 'Apple Watch',
            slug: 'apple-watch',
            brandId: brands[2]._id,
            categoryId: categories[2]._id,
            price: 3000,
            image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ultra-band-unselect-gallery-1-202309_GEO_IN_FMT_WHH?wid=752&hei=720&fmt=p-jpg&qlt=80&.v=1693544568335',
            images: [
                'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MT3U3ref_VW_34FR+watch-case-45-aluminum-pink-nc-s9_VW_34FR+watch-face-45-aluminum-pink-s9_VW_34FR_WF_CO_GEO_IN?wid=2000&hei=2000&fmt=png-alpha&.v=1694507905569',
                'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ML733_VW_34FR+watch-case-41-stainless-gold-s9_VW_34FR+watch-face-41-stainless-gold-s9_VW_34FR?wid=2000&hei=2000&fmt=png-alpha&.v=1694507905569',
                'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/se-case-unselect-gallery-1-202403_GEO_IN_FMT_WHH?wid=752&hei=720&fmt=p-jpg&qlt=80&.v=1709159935679'
            ],
            status: 'active',
            sku: 'APPLE-WATCH-001',
            tags: ['laptop', 'sony', 'vaio'],
            isNew: true,
            stock: 100,
            createdAt: new Date(),
            shortDescription: 'This is a short description',
            longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            companyId,
            name: 'ipad pro',
            slug: 'ipad-pro',
            brandId: brands[0]._id,
            categoryId: categories[0]._id,
            price: 4000,
            image: 'https://i0.wp.com/appleworld.today/wp-content/uploads/2021/07/iPad-Pro.jpg?fit=1000%2C1000&ssl=1',
            images: [
                'https://cdn.mos.cms.futurecdn.net/Qjpn4SD9EqJd2rEYYvYXLA.jpg',
                'https://www.geeky-gadgets.com/wp-content/uploads/2024/03/iPad-Pro.webp',
                'https://i0.wp.com/www.smartprix.com/bytes/wp-content/uploads/2023/11/2024-iPad-Pro.jpg?fit=1200%2C675&ssl=1'
            ],
            status: 'active',
            sku: 'ipad-pro-2024',
            tags: ['laptop', 'apple'],
            isNew: true,
            stock: 100,
            createdAt: new Date(),
            shortDescription: 'This is a short description',
            longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            companyId,
            name: 'Macbook PRO',
            slug: 'macbook-pro',
            brandId: brands[1]._id,
            categoryId: categories[1]._id,
            price: 5000,
            image: 'https://www.apple.com/newsroom/images/product/mac/standard/Apple-MacBook-Pro-M2-Pro-and-M2-Max-hero-230117.jpg.og.jpg?202402191204',
            images: [
                'https://d2xamzlzrdbdbn.cloudfront.net/products/c03dae83-2ad3-4a67-a226-41e93ddb284522161321.jpg',
                'https://inventstore.in/wp-content/uploads/2023/05/macbook-pro-13-silver.png',
                'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/og-macbook-pro-202310?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1697039356093'
            ],
            status: 'active',
            sku: 'MACBOOK-PRO-2024',
            tags: ['laptop', 'apple', 'macbook'],
            isNew: true,
            stock: 100,
            createdAt: new Date(),
            shortDescription: 'This is a short description',
            longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }
    ];
    await db.collection('products').insertMany(products);

    const names = ['Rohinee Tandekar', 'Kiya Gorge', 'David Johnson', 'Emily Brown', 'Michael Wilson'];
    const emails = ['admin@example.com', 'jane@example.com', 'david@example.com', 'emily@example.com', 'michael@example.com'];
    // Create users
    const users = [
        {
            companyId,
            name: 'John Doe',
            email: 'admin@example.com',
            password: bcrypt.hashSync('1234567890', 10),
            mobile: '1234567890',
            role: 'admin',
            status: 'active',
            verifiedAt: new Date(),
            createdAt: new Date()
        },
        {
            companyId,
            name: 'Jane Doe',
            email: 'customer@example.com',
            password: bcrypt.hashSync('123456', 10),
            mobile: '1234567891',
            role: 'customer',
            status: 'active',
            verifiedAt: new Date(),
            createdAt: new Date()
        }
    ];
    for (let i = 0; i < 100; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const email = emails[Math.floor(Math.random() * emails.length)];

        const user = {
            companyId,
            name,
            email,
            password: bcrypt.hashSync('123456', 10), // You may want to change the default password
            mobile: `+1234567890${i.toString().padStart(2, '0')}`, // Sample mobile number with incremental digits
            role: i % 2 === 0 ? 'admin' : 'customer', // Alternate between admin and customer roles
            status: i % 5 === 0 ? 'inactive' : 'active', // Some users are inactive
            verifiedAt: i % 3 === 0 ? null : new Date(), // Some users are not verified
            createdAt: new Date(new Date().getTime() - Math.random() * 1000 * 3600 * 24 * 365) // Random creation date within the past year
        };
        users.push(user);
    }
    await db.collection('users').insertMany(users);

    // Fetch first user with role customer
    const user = await db.collection('users').findOne({ companyId, role: 'customer' });

    // Create 3 shippping addresses
    const shippingAddresses = [
        {
            userId: user._id,
            name: 'John Doe',
            phone: '1234567890',
            pincode: '123456',
            address: '123 Street',
            landmark: 'Thaggu ke samose',
            houseNumber: '123/456',
            city: 'Kochi',
            state: 'Kerala',
            country: 'India',
            status: 'active',
            zip: '123456',
            isDefaultAddress: true,
            createdAt: new Date()
        },
        {
            userId: user._id,
            name: 'George Doe',
            phone: '9087654321',
            pincode: '984657',
            address: '087 winston street',
            landmark: 'Henoi tower',
            houseNumber: '87/989',
            city: 'Houston',
            state: 'Texas',
            country: 'United State',
            status: 'active',
            zip: '30098',
            isDefaultAddress: false,
            createdAt: new Date()
        },
        {
            userId: user._id,
            name: 'Kiran Kaur',
            phone: '889957321187',
            pincode: '327986',
            address: '55 Mark street',
            landmark: 'Effiel tower',
            houseNumber: '87/1334',
            city: 'Houston',
            state: 'Texas',
            country: 'United State',
            status: 'active',
            zip: '30098',
            isDefaultAddress: false,
            createdAt: new Date()
        }
    ];
    await db.collection('shippingAddresses').insertMany(shippingAddresses);

    // Create 3 taxes
    const taxes = [
        {
            companyId,
            name: 'GST',
            rate: 18,
            status: 'active',
            createdAt: new Date()
        },
        {
            companyId,
            name: 'VAT',
            rate: 10,
            status: 'active',
            createdAt: new Date()
        },
        {
            companyId,
            name: 'CGST',
            rate: 9,
            status: 'active',
            createdAt: new Date()
        }
    ];
    await db.collection('taxes').insertMany(taxes);

    // Create sms settings
    const smsSettings = {
        companyId,
        smsFromNumber: '',
        smsSid: '',
        smsAuthToken: '',
        status: 'active'
    };
    await db.collection('smsSettings').insertOne(smsSettings);

    // Create 5 carts
    const carts = [
        {
            companyId,
            userId: users[0]._id,
            addressId: shippingAddresses[0]._id,
            subTotal: 1000,
            discount: 0,
            tax: 0,
            deliveryFee: 10,
            total: 1010,
            deliveryInstruction: 'Please deliver ASAP',
            createdAt: new Date()
        },
        {
            companyId,
            userId: users[0]._id,
            addressId: shippingAddresses[1]._id,
            subTotal: 2000,
            discount: 0,
            tax: 0,
            deliveryFee: 20,
            total: 2020,
            deliveryInstruction: 'Please deliver ASAP',
            createdAt: new Date()
        },
        {
            companyId,
            userId: users[0]._id,
            addressId: shippingAddresses[2]._id,
            subTotal: 3000,
            discount: 0,
            tax: 0,
            deliveryFee: 30,
            total: 3030,
            deliveryInstruction: 'Please deliver ASAP',
            createdAt: new Date()
        },
        {
            companyId,
            userId: users[1]._id,
            addressId: shippingAddresses[0]._id,
            subTotal: 4000,
            discount: 0,
            tax: 0,
            deliveryFee: 40,
            total: 4040,
            deliveryInstruction: 'Please deliver ASAP',
            createdAt: new Date()
        },
        {
            companyId,
            userId: users[1]._id,
            addressId: shippingAddresses[1]._id,
            subTotal: 5000,
            discount: 0,
            tax: 0,
            deliveryFee: 50,
            total: 5050,
            deliveryInstruction: 'Please deliver ASAP',
            createdAt: new Date()
        }
    ];
    await db.collection('carts').insertMany(carts);

    // Create cart items for all carts
    const cartItems = [];
    for (const cart of carts) {
        for (const product of products) {
            cartItems.push({
                companyId,
                cartId: cart._id,
                productId: product._id,
                quantity: 1,
                price: product.price,
                total: product.price
            });
        }
    }
    await db.collection('cartItems').insertMany(cartItems);

    // Create 5 orders
    const orders = [
        {
            companyId,
            userId: users[0]._id,
            addressId: shippingAddresses[0]._id,
            orderNumber: '000001',
            subTotal: 1000,
            discount: 0,
            tax: 0,
            deliveryFee: 10,
            total: 1010,
            deliveryInstruction: 'Please deliver ASAP',
            paymentMethod: 'COD',
            status: 'Ordered',
            createdAt: new Date()
        },
        {
            companyId,
            userId: users[0]._id,
            addressId: shippingAddresses[1]._id,
            orderNumber: '000002',
            subTotal: 2000,
            discount: 0,
            tax: 0,
            deliveryFee: 20,
            total: 2020,
            deliveryInstruction: 'Please deliver ASAP',
            paymentMethod: 'COD',
            status: 'Ordered',
            createdAt: new Date()
        }
    ];
    await db.collection('orders').insertMany(orders);

    // Fetch all orders
    const newResults = await db.collection('orders').find({}).toArray();

    // Fetch all products
    const newProductResults = await db.collection('products').find({}).toArray();

    // Create order items for all orders
    const orderItems = [];

    for (const order of newResults) {
        for (const product of newProductResults) {
            orderItems.push({
                companyId,
                orderId: order._id,
                productId: product._id,
                quantity: 1,
                price: product.price,
                total: product.price
            });
        }
    }
    await db.collection('orderItems').insertMany(orderItems);

    // Create payment for orders
    const payments = [];
    for (const order of orders) {
        payments.push({
            companyId,
            orderId: order._id,
            paymentMethod: 'razorpay',
            status: 'completed',
            amount: 1000,
            createdBy: users[1]._id,
            createdAt: new Date()
        });
    }
    await db.collection('payments').insertMany(payments);

    // Create push notification settings
    const pushNotificationSettings = {
        companyId,
        onesignalAppId: '',
        onesignalApiKey: '',
        status: 'inactive',
        createdAt: new Date()
    };
    await db.collection('pushNotificationSettings').insertOne(pushNotificationSettings);

    // social auth settings
    const socialAuthSettings = {
        companyId,
        facebookClientId: '',
        facebookClientSecret: '',
        facebookStatus: 'inactive',
        googleClientId: '',
        googleClientSecret: '',
        googleStatus: 'inactive',
        linkedinClientId: '',
        linkedinClientSecret: '',
        linkedinStatus: 'inactive',
        twitterClientId: '',
        twitterClientSecret: '',
        twitterStatus: 'inactive',
        createdAt: new Date()
    };
    await db.collection('socialAuthSettings').insertOne(socialAuthSettings);

    // Create 1000 users
    // const randomUsers = [];
    // for (let i = 1; i <= 100; i++) {
    //     randomUsers.push({
    //         companyId,
    //         name: faker.person.fullName(),
    //         email: faker.internet.email(),
    //         password: bcrypt.hashSync(faker.internet.password(), 10),
    //         mobile: faker.phone.number(),
    //         image: faker.image.avatar(),
    //         role: 'customer',
    //         status: 'active',
    //         verifiedAt: new Date(),
    //         createdAt: new Date()
    //     });
    // }

    // await db.collection('users').insertMany(randomUsers);
}

export async function down (db, client) {
    // Empty all collections
    await db.collection('companies').deleteMany({});
    await db.collection('brands').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('companySettings').deleteMany({});
    await db.collection('coupons').deleteMany({});
    await db.collection('emailSettings').deleteMany({});
    await db.collection('languages').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('shippingAddresses').deleteMany({});
    await db.collection('taxes').deleteMany({});
    await db.collection('smsSettings').deleteMany({});
    await db.collection('carts').deleteMany({});
    await db.collection('cartItems').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('orderItems').deleteMany({});
}
