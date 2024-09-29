# Overview

## What is Highlevel Appointment Project ?

Highlevel Appointment Project is a test project which is a part of Highlevel hiring challenge. This is the backend part of that application.

## About `Highlevel Appointment Project Backend`

`Highlevel Appointment Project Backend` is an appointment booking API for Dr. John, which is part of the Highlevel Hiring project.

## Gear Up For Development

To get started with project, you can follow these steps:

1. Install [npm](https://www.npmjs.com) and [nodejs](https://nodejs.org/en) on your system.
2. Clone this repository:
3. `git clone https://github.com/Sparsh-Kumar/highlevel-appointment-project-backend.git`
4. `cd highlevel-appointment-project-backend`
5. Install dependencies using `npm install`
6. Create a `.env` file in the root directory of the project.
7. Copy the contents of `.env.sample` and place them in `.env` file. Set the value of appropriate credentials.
8. Start the API server in the development mode using `npm run start:dev`

## Test Cases
1. Test cases are mentioned in an elaborative way [here](https://docs.google.com/spreadsheets/d/1t7g3VRN-glGiNbz4dMz4FS_IU2uS_rGtb6otxUvjXVs/edit?gid=0#gid=0)
2. The application passes all test cases.

# API Endpoints

`Doctor Entity (Extra Functionality Included)` 

1. GET `http://{{BASE_API_ENDPOINT}}/doctors`
   
   Usage : Get list of all doctors available in the system.

   Response Code : 200

   Response:
   ```
    {
        "data": [
            {
                "id": "4epCgTycHcb120LYNgeP",
                "name": "John",
                "email": "john@hotmail.com"
            }
        ],
        "error": null,
        "statusCode": 200
    }
   ```
3. GET `http://{{BASE_API_ENDPOINT}}/doctors/{{id}}`
   
   Usage : Get details of a particular doctor.

   Response Code : 200

   Response:
   ```
    {
        "data": {
            "name": "John",
            "email": "john@hotmail.com"
        },
        "error": null,
        "statusCode": 200
    }
   ```
5. POST `http://{{BASE_API_ENDPOINT}}/doctors`
   
   Usage : Create a new doctor.

   Response Code : 200

   Response:
   ```
   {}
   ```
   
`Appointment Entity (Required Functionality Of Project)`

1. POST `http://{{BASE_API_ENDPOINT}}/appointments`

   Usage : Create an appointment.

   Request Body:
   ```
    {
        "doctorId": "4epCgTycHcb120LYNgeP",
        "patientName": "Sparsh Kumar",
        "appointmentDate": "2024-09-28",
        "appointmentStartTime": "00:30",
        "appointmentDuration": 30,
        "timeZone": "America/Los_Angeles"
    }
   ```
   
   Response Code : 200

   Response Body:
   ```
    {
        "data": {
            "notes": "",
            "appointmentStartTime": {
                "seconds": 1727508600,
                "nanoseconds": 0
            },
            "patientName": "Sparsh Kumar",
            "appointmentDate": {
                "seconds": 1727481600,
                "nanoseconds": 0
            },
            "doctorId": "4epCgTycHcb120LYNgeP",
            "appointmentEndTime": {
                "seconds": 1727510400,
                "nanoseconds": 0
            },
            "appointmentDuration": 30
        },
        "error": null,
        "statusCode": 201
    }
   ```

2. POST `http://{{BASE_API_ENDPOINT}}/appointments/all`

   Usage : Get all appointments of a doctor from `startDate` to `endDate`

   Request Body:
   ```
    {
        "startDate": "2024-09-27",
        "endDate": "2024-09-28",
        "doctorId": "4epCgTycHcb120LYNgeP",
        "timeZone": "America/Los_Angeles"
    }
   ```

   Response Code : 200
   
   Response Body:
   ```
    {
        "data": [
            {
                "id": "RbDG1Ux45A32NKfGHUw3",
                "doctorId": "4epCgTycHcb120LYNgeP",
                "appointmentEndTime": "2024-09-27 21:00",
                "appointmentDate": "2024-09-27",
                "appointmentStartTime": "2024-09-27 20:30",
                "appointmentDuration": 30,
                "notes": "",
                "patientName": "Sparsh Kumar"
            },
            {
                "id": "SMHknmQGX5WAsO4SHMn6",
                "appointmentDuration": 30,
                "notes": "",
                "appointmentDate": "2024-09-27",
                "doctorId": "4epCgTycHcb120LYNgeP",
                "appointmentStartTime": "2024-09-28 00:30",
                "appointmentEndTime": "2024-09-28 01:00",
                "patientName": "Sparsh Kumar"
            },
        ],
        "error": null,
        "statusCode": 200
    }
   ```

3. POST `http://{{BASE_API_ENDPOINT}}/appointments/slots`

   Usage : Get free available slots of a doctor for a particular date.

   Request Body:
   ```
    {
        "doctorId": "4epCgTycHcb120LYNgeP",
        "date": "2024-09-29",
        "timeZone": "Asia/Kolkata"
    }
   ```

   Response Code : 200

   Response Body:
   ```
    {
        "data": [
            {
                "slotStartingTime": "2024-09-29 08:00",
                "slotEndingTime": "2024-09-29 08:30"
            },
            {
                "slotStartingTime": "2024-09-29 08:30",
                "slotEndingTime": "2024-09-29 09:00"
            },
            {
                "slotStartingTime": "2024-09-29 09:00",
                "slotEndingTime": "2024-09-29 09:30"
            },
        ],
        "error": null,
        "statusCode": 200
    }
   ```
## Contributing

Contributions are welcome! Feel free to open issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Sparsh-Kumar/backtesting.py/blob/main/LICENSE) file for details

