# API Documentation

## API 101

**Type**: REST

**Method**: POST

**Endpoint**: /api/upload-csv

**Request**:

*must be submitted as form*
| Param | Type | Example |
| ----------- | ----------- | ----------- |
| csv-file | File | ... |
| type | "CAPACITY" or "CYCLE_INFO" | ... |
| name | string | "Example capacity file" |

SID must be in cookie

**Response**:
Standard HTTP response

## API 102

**Type**: REST

**Method**: GET

**Endpoint**: /api/get-session

**Request**:
Empty

**Response**:

"SID" set as httponly cookie


## API 103

**Type**: REST

**Method**: GET

**Endpoint**: /api/myfiles

**Request**:

SID must be in cookie

**Response**:

List of following data:
| Param | Type |
| ----------- | ----------- |
| filename | File |
| file_type | "CAPACITY" or "CYCLE_INFO" |

## API 104

**Type**: REST

**Method**: GET

**Endpoint**: /api/filecontent

**Request**:

SID must be in cookie

| Param | Type |
| ----------- | ----------- |
| filename | File |
| file_type | "CAPACITY" or "CYCLE_INFO" |
| filters | Anything (see bellow) |

Filter argument can be any object. But the server understands the following:
```
{
  "minCycleNumber": "value",
  "maxCycleNumber": "value",
  "minTime": "value",
  "maxTime": "value",
  ...
}
```

**Response**:

An array of data where the properties corresponds to type of data i.e. capcity or cycle info
