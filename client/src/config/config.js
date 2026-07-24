export const BrandTemplate = [
  {
    id:"adidas",
    label : "Adidas",
    logo : "https://res.cloudinary.com/dumsku7ua/image/upload/v1733898229/Adidas_Logo_myoqex.svg"
  },
  {
    id:"nike",
    label : "Nike",
    logo : "https://res.cloudinary.com/dumsku7ua/image/upload/v1733898258/Logo_NIKE_ewzhtq.svg"
  },
  {
    id:"puma",
    label : "Puma",
    logo : "https://res.cloudinary.com/dumsku7ua/image/upload/v1733898271/Puma-logo-_28text_29_fnhjee.svg"
  },
  {
    id:"supreme",
    label : "Supreme",
    logo : "https://res.cloudinary.com/dumsku7ua/image/upload/v1733898284/1200px-Supreme-logo-newyork_hvjvcb.png"
  },
  {
    id:"zara",
    label : "Zara",
    logo : "https://res.cloudinary.com/dumsku7ua/image/upload/v1733898297/Zara_Logo_jpdrse.svg"
  },
  {
    id:"h&m",
    label : "H&M",
    logo : "https://res.cloudinary.com/dumsku7ua/image/upload/v1733898311/H_26M-Logo_wlrnbm.svg"
  }
];

export const SignupFormTemplate = [
    {
        name : 'username',
        label : 'Username',
        placeholder : "Enter your username",
        component : "input",
        type : "text"
    },
    {
        name : 'email',
        label : 'Email',
        placeholder : "Enter your email",
        component : "input",
        type : "email"
    },
    {
        name : 'password',
        label : 'Password',
        placeholder : "Enter your password",
        component : "input",
        type : "password"
    }
];

export const LoginFormTemplate = [
    {
        name : 'email',
        label : 'Email',
        placeholder : "Enter your email",
        component : "input",
        type : "email"
    },
    {
        name : 'password',
        label : 'Password',
        placeholder : "Enter your password",
        component : "input",
        type : "password"
    }
];

export const NewProductFormTemplate = [
    {
      label: "Title",
      name: "title",
      component: "input",
      type: "text",
      placeholder: "Enter product title",
    },
    {
      label: "Description",
      name: "description",
      component: "textarea",
      placeholder: "Enter product description",
    },
    {
      label: "Category",
      name: "category",
      component: "select",
      options: [
        { id: "men", label: "Men" },
        { id: "women", label: "Women" },
        { id: "kids", label: "Kids" },
        { id: "accessories", label: "Accessories" },
        { id: "footwear", label: "Footwear" },
      ],
    },
    {
      label: "Brand",
      name: "brand",
      component: "select",
      options: BrandTemplate,
    },
    {
      label: "Price",
      name: "price",
      component: "input",
      type: "number",
      placeholder: "Enter product price",
    },
    {
      label: "Sale Price (Must be lower than original)",
      name: "salePrice",
      component: "input",
      type: "number",
      placeholder: "Enter sale price (Optional)",
    },
    {
      label: "Featured",
      name: "featured",
      component: "select",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
      ],
    },
  ];

export const AddressFormTemplate = [
  {
    label: "Address",
    name: "address",
    component: "textarea",
    type: "text",
    placeholder: "Enter Address",
  },
  {
    label: "City",
    name: "city",
    component: "input",
    type: "text",
    placeholder: "Enter City",
  },
  {
    label: "Pincode (6 digits)",
    name: "pincode",
    component: "input",
    type: "text",
    placeholder: "Enter Pincode",
  },
  {
    label: "Contact (10 digits)",
    name: "contact",
    component: "input",
    type: "text",
    placeholder: "Enter Contact number",
  },
  {
    label: "Landmark ",
    name: "landmark",
    component: "textarea",
    type: "text",
    placeholder: "Enter Landmark description",
  }
];

export const CustomerHomeMenuItems = [
    {
      id : "home",
      label : "Home",
      route : "/shop/home"
    },
    {
      id : "catalog",
      label : "Collection",
      route : "/shop/catalog"
    },
    {
      id : "men",
      label : "Men",
      route : "/shop/catalog"
    },
    {
      id : "women",
      label : "Women",
      route : "/shop/catalog"
    },
    {
      id : "kids",
      label : "Kids",
      route : "/shop/catalog"
    },
    {
      id : "accessories",
      label : "Accessories",
      route : "/shop/catalog"
    },
    {
      id : "footwear",
      label : "Footwear",
      route : "/shop/catalog"
    },
];

export const FilterOptions = {
  Category : [
      {
        id:"men",
        label : "Men"
      },
      {
        id:"women",
        label : "Women"
      },
      {
        id:"kids",
        label : "Kids"
      },
      {
        id:"accessories",
        label : "Accessories"
      },
      {
        id:"footwear",
        label : "Footwear"
      }
  ],
  Brand : BrandTemplate
}

export const SortOptions = [
  {
    id:"latest",
    label : "Latest"
  },
  {
    id:"price_L_to_H",
    label : "Price • Low to High"
  },
  {
    id:"price_H_to_L",
    label : "Price • High to Low"
  },
  {
    id:"product_A_to_Z",
    label : "Products • A to Z"
  },
  {
    id:"product_Z_to_A",
    label : "Products • Z to A"
  }
];

export const sizeOptions = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL"
]

export const CategoryColor = {
  "Men": "#1F4E79",
  "Women": "#8E3A59",
  "Kids": "#F4A261",
  "Accessories": "#3D405B",
  "Footwear": "#2A9D8F"
}

export const OrderStatusColor = {
  "Confirmed": "#5A82B4",
  "Processing": "#728AB7",
  "Shipping": "#4C9A76",
  "Out for Delivery": "#D39F5D",
  "Delivered": "#76A365",
  "Cancelled": "#B46969"
}
