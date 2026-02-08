
```postgresql
create table if not exists manufacturers (
  manufacturer_id bigserial primary key,

  code text not null unique,          -- 'hyundai'
  name text not null,                 -- '현대'
  logo_path text not null,            -- '/images/manufacturers/hyundai.svg'
  category text not null,             -- 'DOMESTIC' | 'IMPORT'

  -- 유일하게 유지되는 정렬 컬럼
  sort_order integer not null,

  is_visible boolean not null default true,

  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists sale_cars (
  sale_car_id bigserial primary key,

  manufacturer_id bigint not null
    references manufacturers(manufacturer_id)
    on delete restrict,

  name text not null,
  description text null,
  thumbnail_path text not null,
  rent_price integer null,
  lease_price integer null,

  badges text[] not null default '{}'::text[],

  is_visible boolean not null default true,

  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists released_cars (
  released_car_id bigserial primary key,

  car_name text not null,
  thumbnail_path text not null,
  released_at date not null,

  is_visible boolean not null default true,

  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists users (
  id serial primary key,

  username varchar(50) unique not null,
  password varchar(255) not null,  -- bcrypt hash
  nickname varchar(50) not null,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

```