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

**Response**:
Standard HTTP response

