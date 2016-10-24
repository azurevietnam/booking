-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2016-10-23 12:16:30.854

-- tables
-- Table: baggage_type
CREATE TABLE baggage_type (
    id int NOT NULL AUTO_INCREMENT,
    provider_id int NOT NULL,
    name varchar(150) NOT NULL,
    fare float NOT NULL,
    CONSTRAINT baggage_type_pk PRIMARY KEY (id)
);

-- Table: banner
CREATE TABLE banner (
    id int NOT NULL AUTO_INCREMENT,
    tittle varchar(200) NOT NULL,
    img varchar(200) NOT NULL,
    url varchar(1000) NOT NULL,
    description varchar(1000) NOT NULL,
    active boolean NOT NULL,
    CONSTRAINT banner_pk PRIMARY KEY (id)
);

-- Table: booking
CREATE TABLE booking (
    id int NOT NULL AUTO_INCREMENT,
    one_way boolean NOT NULL,
    adult int NOT NULL,
    children int NOT NULL,
    infant int NOT NULL,
    ticket_type_id int NOT NULL,
    remark varchar(1000) NOT NULL,
    CONSTRAINT booking_pk PRIMARY KEY (id)
);

-- Table: booking_detail
CREATE TABLE booking_detail (
    id int NOT NULL AUTO_INCREMENT,
    booking_id int NOT NULL,
    code varchar(20) NOT NULL,
    depart int NOT NULL,
    departure date NULL,
    arrive int NOT NULL,
    arrival date NULL,
    one_way boolean NOT NULL,
    depart_duration int NULL,
    return_duration int NULL,
    CONSTRAINT booking_detail_pk PRIMARY KEY (id)
);

-- Table: bus_route
CREATE TABLE bus_route (
    id int NOT NULL AUTO_INCREMENT,
    code varchar(20) NOT NULL,
    depart int NOT NULL,
    departure date NULL,
    arrive int NOT NULL,
    arrival date NULL,
    bus_type_id int NOT NULL,
    depart_duration int NULL,
    return_duration int NULL,
    fare float NOT NULL,
    CONSTRAINT bus_route_pk PRIMARY KEY (id)
);

-- Table: bus_type
CREATE TABLE bus_type (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    CONSTRAINT bus_type_pk PRIMARY KEY (id)
);

-- Table: comment
CREATE TABLE comment (
    id int NOT NULL AUTO_INCREMENT,
    full_name int NOT NULL,
    comment varchar(1000) NOT NULL,
    created_at date NOT NULL,
    active boolean NOT NULL,
    CONSTRAINT comment_pk PRIMARY KEY (id)
);

-- Table: contact
CREATE TABLE contact (
    id int NOT NULL AUTO_INCREMENT,
    booking_id int NOT NULL,
    title int NOT NULL,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    phone varchar(11) NOT NULL,
    email varchar(50) NOT NULL,
    CONSTRAINT contact_pk PRIMARY KEY (id)
);

-- Table: fare
CREATE TABLE fare (
    id int NOT NULL AUTO_INCREMENT,
    passenger_id int NOT NULL,
    one_way boolean NOT NULL,
    fare float NOT NULL,
    charge float NOT NULL,
    tax float NOT NULL,
    baggage_type_id int NOT NULL,
    CONSTRAINT fare_pk PRIMARY KEY (id)
);

-- Table: location
CREATE TABLE location (
    id int NOT NULL AUTO_INCREMENT,
    code char(3) NOT NULL,
    name varchar(50) NOT NULL,
    CONSTRAINT location_pk PRIMARY KEY (id)
);

-- Table: passenger
CREATE TABLE passenger (
    id int NOT NULL AUTO_INCREMENT,
    booking_id int NOT NULL,
    title int NOT NULL,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    birthdate date NOT NULL,
    phone varchar(11) NOT NULL,
    email varchar(50) NOT NULL,
    CONSTRAINT passenger_pk PRIMARY KEY (id)
);

-- Table: provider
CREATE TABLE provider (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(20) NOT NULL,
    CONSTRAINT provider_pk PRIMARY KEY (id)
);

-- Table: ticket_type
CREATE TABLE ticket_type (
    id int NOT NULL AUTO_INCREMENT,
    provider int NOT NULL,
    type int NOT NULL,
    CONSTRAINT ticket_type_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: baggage_type_provider (table: baggage_type)
ALTER TABLE baggage_type ADD CONSTRAINT baggage_type_provider FOREIGN KEY baggage_type_provider (provider_id)
    REFERENCES provider (id);

-- Reference: booking_ticket_type (table: booking)
ALTER TABLE booking ADD CONSTRAINT booking_ticket_type FOREIGN KEY booking_ticket_type (ticket_type_id)
    REFERENCES ticket_type (id);

-- Reference: bus_info_bus_type (table: bus_route)
ALTER TABLE bus_route ADD CONSTRAINT bus_info_bus_type FOREIGN KEY bus_info_bus_type (bus_type_id)
    REFERENCES bus_type (id);

-- Reference: contact_booking (table: contact)
ALTER TABLE contact ADD CONSTRAINT contact_booking FOREIGN KEY contact_booking (booking_id)
    REFERENCES booking (id);

-- Reference: fare_baggage_type (table: fare)
ALTER TABLE fare ADD CONSTRAINT fare_baggage_type FOREIGN KEY fare_baggage_type (baggage_type_id)
    REFERENCES baggage_type (id);

-- Reference: fare_passengers (table: fare)
ALTER TABLE fare ADD CONSTRAINT fare_passengers FOREIGN KEY fare_passengers (passenger_id)
    REFERENCES passenger (id);

-- Reference: flight_booking (table: booking_detail)
ALTER TABLE booking_detail ADD CONSTRAINT flight_booking FOREIGN KEY flight_booking (booking_id)
    REFERENCES booking (id);

-- Reference: flight_location_arrive (table: booking_detail)
ALTER TABLE booking_detail ADD CONSTRAINT flight_location_arrive FOREIGN KEY flight_location_arrive (arrive)
    REFERENCES location (id);

-- Reference: flight_location_depart (table: booking_detail)
ALTER TABLE booking_detail ADD CONSTRAINT flight_location_depart FOREIGN KEY flight_location_depart (depart)
    REFERENCES location (id);

-- Reference: passengers_booking (table: passenger)
ALTER TABLE passenger ADD CONSTRAINT passengers_booking FOREIGN KEY passengers_booking (booking_id)
    REFERENCES booking (id);

-- Reference: ticket_type_airlines (table: ticket_type)
ALTER TABLE ticket_type ADD CONSTRAINT ticket_type_airlines FOREIGN KEY ticket_type_airlines (provider)
    REFERENCES provider (id);

-- End of file.
