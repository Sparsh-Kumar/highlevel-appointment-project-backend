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
8. Start the API server in the development mode using `npm run devstart`

## Test Cases
1. Test cases are mentioned in an elaborative way [here](https://docs.google.com/spreadsheets/d/1t7g3VRN-glGiNbz4dMz4FS_IU2uS_rGtb6otxUvjXVs/edit?gid=0#gid=0)
2. The application passes all test cases.


## API Endpoints

### `Doctor` Entity (Additional Functionality)

1. `POST /doctors`
   
    API Endpoint Usage : This API endpoint is used to create `Doctor` entity in the firestore database.

    Request Body:
    ```
    {
        "name": "Kon",
        "email": "kon@hotmail.com"
    }
    ```

    Response Body:
    ```
    {
        "data": {
            "email": "kon@hotmail.com",
            "name": "Kon"
        },
        "error": null,
        "statusCode": 201
    }
    ```
3. `GET /doctors`

   API Endpoint Usage : This API endpoint is used to get all `Doctor` entity information.
   
   Response Body:
   ```
    {
        "data": [
            {
                "id": "4epCgTycHcb120LYNgeP",
                "email": "john@hotmail.com",
                "name": "John"
            },
            {
                "id": "lXQgNFjIkIHMH6Yax90E",
                "name": "Kon",
                "email": "kon@hotmail.com"
            }
        ],
        "error": null,
        "statusCode": 200
    }
   ``` 
4. `GET /doctors/:id`

   API Endpoint Usage : This API endpoint is used to get a particular `Doctor` entity information.

   Response Body:
   ```
    {
        "data": {
            "email": "kon@hotmail.com",
            "name": "Kon"
        },
        "error": null,
        "statusCode": 200
    }
   ```

### `Appointment` Entity (Required Functionality)

1. `POST /appointments`

   API Endpoint Usage : Create an appointment.

   Request Body:
   ```
   {
       "doctorId": "4epCgTycHcb120LYNgeP",
        "patientName": "Sparsh Kumar",
        "appointmentDate": "2024-09-28",
        "appointmentStartTime": "08:30",
        "appointmentDuration": 30
   }
   ```

   Response Body:
   ```
   {
        "data": {
            "notes": "",
            "doctorId": "4epCgTycHcb120LYNgeP",
            "patientName": "Sparsh Kumar",
            "appointmentEndTime": {
                "seconds": 1727494200,
                "nanoseconds": 0
            },
            "appointmentDuration": 30,
            "appointmentDate": {
                 "seconds": 1727481600,
                 "nanoseconds": 0
            },
            "appointmentStartTime": {
                "seconds": 1727492400,
                "nanoseconds": 0
            }
        },
        "error": null,
        "statusCode": 201
    }
   ```
   
   Error Handling:
   1. API endpoint returns an error if you want to create an appointment which is conflicting with already created ones.
   2. If you want to create appointment before & after the availability time of the doctor.
  
3. `GET /appointments?startDate={{YYYY-MM-DD}}&endDate={{YYYY-MM-DD}}`
   
   API Endpoint Usage : Gives a list of appointments from `startDate` to `endDate`.

   Response:
   ```
    {
        "data": [
            {
                "appointmentEndTime": "2024-09-28 09:00",
                "patientName": "Sparsh Kumar",
                "doctorId": "4epCgTycHcb120LYNgeP",
                "appointmentDuration": 30,
                "appointmentDate": "2024-09-28",
                "appointmentStartTime": "2024-09-28 08:30",
                "notes": ""
            }
        ],
        "error": null,
        "statusCode": 200
    }
   ```

   Error Handling:
   1. API endpoint throws an error when `endDate` < `startDate`.
   2. If no `endDate` is given then It would return all `Appointments` from `startDate`.
  
4. `GET /appointments/slots/:date`

   API Endpoint Usage : It gives the free available slots on a given date for a doctor. The `date` parameter should be passed in `YYYY-MM-DD` format.

   Response:
   ```
    {
        "data": [
            {
                "slotStartingTime": "2024-09-28 08:00",
                "slotEndingTime": "2024-09-28 08:30"
            },
            {
                "slotStartingTime": "2024-09-28 09:00",
                "slotEndingTime": "2024-09-28 09:30"
            },
            {
                "slotStartingTime": "2024-09-28 09:30",
                "slotEndingTime": "2024-09-28 10:00"
            },
            {
                "slotStartingTime": "2024-09-28 10:00",
                "slotEndingTime": "2024-09-28 10:30"
            },
            {
                "slotStartingTime": "2024-09-28 10:30",
                "slotEndingTime": "2024-09-28 11:00"
            },
            {
                "slotStartingTime": "2024-09-28 11:00",
                "slotEndingTime": "2024-09-28 11:30"
            },
            {
                "slotStartingTime": "2024-09-28 11:30",
                "slotEndingTime": "2024-09-28 12:00"
            },
            {
                "slotStartingTime": "2024-09-28 12:00",
                "slotEndingTime": "2024-09-28 12:30"
            },
            {
                "slotStartingTime": "2024-09-28 12:30",
                "slotEndingTime": "2024-09-28 13:00"
            },
            {
                "slotStartingTime": "2024-09-28 13:00",
                "slotEndingTime": "2024-09-28 13:30"
            },
            {
                "slotStartingTime": "2024-09-28 13:30",
                "slotEndingTime": "2024-09-28 14:00"
            },
            {
                "slotStartingTime": "2024-09-28 14:00",
                "slotEndingTime": "2024-09-28 14:30"
            },
            {
                "slotStartingTime": "2024-09-28 14:30",
                "slotEndingTime": "2024-09-28 15:00"
            },
            {
                "slotStartingTime": "2024-09-28 15:00",
                "slotEndingTime": "2024-09-28 15:30"
            },
            {
                "slotStartingTime": "2024-09-28 15:30",
                "slotEndingTime": "2024-09-28 16:00"
            },
            {
                "slotStartingTime": "2024-09-28 16:00",
                "slotEndingTime": "2024-09-28 16:30"
            },
            {
                "slotStartingTime": "2024-09-28 16:30",
                "slotEndingTime": "2024-09-28 17:00"
            }
        ],
     "error": null,
     "statusCode": 200
   }
   ```

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Sparsh-Kumar/backtesting.py/blob/main/LICENSE) file for details

