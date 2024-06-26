CREATE TABLE VALID_SESSION_ID (
    SID UUID DEFAULT gen_random_uuid() PRIMARY KEY 
);

CREATE TABLE CAPACITY_INFO (
    SID UUID,
    FILENAME VARCHAR(500),
    CYCLE_NUMBER NUMERIC,
    CAPACITY NUMERIC,
    PRIMARY KEY(SID, FILENAME, CYCLE_NUMBER),
	FOREIGN KEY (SID) REFERENCES VALID_SESSION_ID(SID) ON DELETE CASCADE
);

CREATE TABLE CYCLE_INFO (
    SID UUID,
    FILENAME VARCHAR(500),
    CYCLE_NUMBER NUMERIC,
    TIME NUMERIC,
    CURRENT NUMERIC,
    VOLTAGE NUMERIC,
    ID UUID DEFAULT gen_random_uuid(),
    PRIMARY KEY(SID, ID),
	FOREIGN KEY (SID) REFERENCES VALID_SESSION_ID(SID) ON DELETE CASCADE
);

CREATE TABLE FILE_LIST(
    SID UUID,
    FILENAME VARCHAR(500),
    FILE_TYPE VARCHAR(500),
    PRIMARY KEY(SID, FILENAME, FILE_TYPE),
    FOREIGN KEY (SID) REFERENCES VALID_SESSION_ID(SID) ON DELETE CASCADE
)