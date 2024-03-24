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
