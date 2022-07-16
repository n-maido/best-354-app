-- CREATE Entity tables
CREATE TABLE Blood_Bank(
 	instNo SERIAL UNIQUE,
 	address char(40),
 	PRIMARY KEY (instNo)
);

CREATE TABLE Blood_Drive(
 	driveID SERIAL UNIQUE,
 	instNo SERIAL UNIQUE,
    address char(40),
 	PRIMARY KEY (driveID),
    CONSTRAINT fk_instNo FOREIGN KEY(instNo) REFERENCES Blood_Bank(instNo)
); 


CREATE TABLE Hospital(
 	instNo SERIAL UNIQUE,
 	address char(40),
 	PRIMARY KEY (instNo)
);

CREATE TABLE Volunteer(
	vID SERIAL UNIQUE,
 	name char(40),
 	PRIMARY KEY (vID)
);


CREATE TABLE Donor_Contact(
	email char(40),
 	phoneNo TEXT,
	address char(40),
 	name char(40),
	PRIMARY KEY (email)
);

CREATE TABLE Donor(
	donorID SERIAL UNIQUE,
 	dob date,
 	gender char(40),
 	weight DECIMAL(3,2),
 	totDonations integer,
 	eligibility boolean,
 	bloodType char(40),
 	email char(40) UNIQUE,
 	CONSTRAINT fk_email FOREIGN KEY(email) REFERENCES Donor_Contact(email)
);
 	
CREATE TABLE Blood_Bag (
 	bloodID SERIAL UNIQUE, 
 	expiryDate date, 
 	bloodType char(40),
 	quantity DECIMAL(3, 2), 
 	donationDate date, 
 	bloodStatus char(40), 
 	curAddress char(40), 
 	PRIMARY KEY (bloodID) 
);  


CREATE TABLE Recipient (
 	rID SERIAL UNIQUE, 
 	name char(40), 
 	dob date, 
 	gender char(40), 
 	weight DECIMAL(3,2), 
 	bloodType char(40), 
 	PRIMARY KEY (rID) 
);


CREATE TABLE Phlebotomist (
 	phlebID SERIAL UNIQUE, 
 	name char(40), 
 	instNo SERIAL UNIQUE, 
 	PRIMARY KEY (phlebID),
    FOREIGN KEY (instNo) REFERENCES Blood_Bank(instNo)
);


CREATE TABLE Red_Blood_Cells (
 	bloodID SERIAL UNIQUE, 
 	hematocritLevel DECIMAL(5, 4), 
 	hemoglobinLevel INT, 
 	CONSTRAINT fk_bloodID FOREIGN KEY(bloodID) REFERENCES Blood_Bag(bloodID) 
);

CREATE TABLE Plasma (
 	bloodID SERIAL UNIQUE, 
 	plasmaCount int, 
 	CONSTRAINT fk_bloodID FOREIGN KEY(bloodID) REFERENCES Blood_Bag(bloodID)
);


CREATE TABLE Platelets(
 	bloodID SERIAL UNIQUE, 
 	plateletsCount int, 
 	CONSTRAINT fk_bloodID FOREIGN KEY(bloodID) REFERENCES Blood_Bag(bloodID)
);

-- CREATE Relationship tables

CREATE TABLE ConductQuestionnaire(
	vID SERIAL UNIQUE, 
    donorID SERIAL UNIQUE,
    PRIMARY KEY (vID, donorID),
	FOREIGN KEY (vID) REFERENCES Volunteer(vID)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
	FOREIGN KEY (donorID) REFERENCES Donor(donorID)
		ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE Donate_Donor(
	donorID SERIAL UNIQUE,
 	time TIMESTAMP UNIQUE,
	driveID SERIAL UNIQUE,
	instNo SERIAL UNIQUE,
    PRIMARY KEY (donorID, time),
	FOREIGN KEY (donorID) REFERENCES Donor(donorID)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
	FOREIGN KEY (driveID) REFERENCES Blood_Drive(driveID)
		ON DELETE SET NULL
        ON UPDATE CASCADE,
	FOREIGN KEY (instNo) REFERENCES Blood_Bank(instNo)
		ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE Donate_Blood(
	bloodID SERIAL UNIQUE,
	donorID SERIAL UNIQUE,
 	time TIMESTAMP, 
 	PRIMARY KEY (bloodID),
 	FOREIGN KEY (bloodID) REFERENCES Blood_Bag(bloodID),
	FOREIGN KEY (donorID) REFERENCES Donor(donorID),
	FOREIGN KEY (time) REFERENCES Donate_Donor(time)
);

CREATE TABLE TransportToBloodBank(
	bloodID SERIAL UNIQUE,
	driveID SERIAL UNIQUE,
	instNo SERIAL UNIQUE,
	time TIMESTAMP,
	PRIMARY KEY (bloodID),
	FOREIGN KEY (bloodID) REFERENCES Blood_Bag(bloodID)
		ON DELETE SET NULL
        ON UPDATE CASCADE,
	FOREIGN KEY (driveID) REFERENCES Blood_Drive(driveID)
		ON DELETE SET NULL
        ON UPDATE CASCADE,
	FOREIGN KEY (instNo) REFERENCES Blood_Bank(instNo)
		ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE TransportToHospital(
	bloodID SERIAL UNIQUE,
	bankInstNo SERIAL UNIQUE,
	hospitalInstNo SERIAL UNIQUE,
	time TIMESTAMP,
	PRIMARY KEY (bloodID),
	FOREIGN KEY (bloodID) REFERENCES Blood_Bag(bloodID)
		ON DELETE SET NULL
        ON UPDATE CASCADE,
	FOREIGN KEY (bankInstNo) REFERENCES Blood_Bank(instNo)
		ON DELETE SET NULL
        ON UPDATE CASCADE,
	FOREIGN KEY (hospitalInstNo) REFERENCES Hospital(instNo)
		ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE DisposeBlood(
	bankInstNo SERIAL UNIQUE,
	bloodID SERIAL UNIQUE,
	time TIMESTAMP,
	PRIMARY KEY (bloodID),
	FOREIGN KEY (bankInstNo) REFERENCES Blood_Bank(instNo)
		ON DELETE SET NULL
        ON UPDATE CASCADE,
	FOREIGN KEY (bloodID) REFERENCES Blood_Bag(bloodID)
		ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE TestBlood(
	bloodID SERIAL UNIQUE,
	instNo SERIAL UNIQUE,
	phlebID SERIAL UNIQUE,
	time TIMESTAMP,	
	PRIMARY KEY (bloodID),
	FOREIGN KEY (bloodID) REFERENCES Blood_Bag(bloodID)
		ON DELETE SET NULL
        ON UPDATE CASCADE,
	FOREIGN KEY (instNo) REFERENCES Blood_Bank(instNo)
		ON DELETE SET NULL
        ON UPDATE CASCADE,
	FOREIGN KEY (phlebID) REFERENCES Phlebotomist(phlebID)
		ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE Transfusion(
	rID SERIAL UNIQUE,
	instNo SERIAL UNIQUE,
	time TIMESTAMP,
	FOREIGN KEY (rID) REFERENCES Recipient(rID)
		ON DELETE SET NULL
        ON UPDATE CASCADE,
	FOREIGN KEY (instNo) REFERENCES Hospital(instNo)
		ON DELETE SET NULL
        ON UPDATE CASCADE
);
