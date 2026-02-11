Table Users {
  id integer [primary key]
  username varchar
  email varchar [unique]
  password varchar
  role varchar
  date_joined timestamp
}

Table Cards {
  id integer [primary key]
  name varchar
  collection_id integer
  rarity_id integer
  image_url varchar
  recommended_price decimal
}

Table Listings {
  id integer [primary key]
  seller_id integer
  card_id integer
  price decimal
  quantity integer
  condition varchar
  status varchar
  description text
  created_at timestamp
}

Table Orders {
  id integer [primary key]
  buyer_id integer
  total_price decimal
  status varchar
  shipping_address_id integer
  created_at timestamp
}

Table Order_details {
  id integer [primary key]
  order_id integer
  listing_id integer
  quantity integer
  unit_price decimal
}

Table Cart {
  id integer [primary key]
  user_id integer
  listing_id integer
  quantity integer
  added_at timestamp
}

Table Reviews {
  id integer [primary key]
  order_id integer
  rating integer
  comment text
  created_at timestamp
}


Ref: Users.id < Listings.seller_id
Ref: Cards.id < Listings.card_id


Ref: Users.id < Orders.buyer_id


Ref: Orders.id < Order_details.order_id
Ref: Listings.id < Order_details.listing_id


Ref: Users.id < Cart.user_id
Ref: Listings.id < Cart.listing_id

Ref: Orders.id - Reviews.order_id


