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
| Param | Type | Example |
| ----------- | ----------- | ----------- |
| id | uuid | "550e8400-e29b-41d4-a716-446655440000" |
| name | string | "Example capcity file" |

