# Cars

Cars Management Factory

## Project Setup

* Install Dependencies

```
npm i
```

* Build Component

```
npm run build
```

* Start Component

```
npm start
```


Listed below are the other cli options you have for interacting with the component

```
# set start component in watch mode
npm run watch

# start mongodb container for local use
npm run start:mongodb

# run the existing test suite
npm test

# run "docker-compose build && docker-compose up"
npm run start:docker
```

## How to call API?
* There is a `CARS` postman collection in the root directory for use if needed. There are example `curl` requests below that should work too. 

The API essentially has 4 endpoints, `POST /car`, `GET /car`, `PUT /car`, and `DELETE /car`. 

The properties of a car are `model`, `brand`, `color`, `people` and `distance`. The first three are strings, whereas `people` and `distance`, representing the number of people that can fit into a car and the distance it has travelled are numbers. Neither `people` nor `distance` can be negative and `people` can't be more than 10. 

Below are example requests for each route

`POST /car`

```
## Request
curl --location --request POST 'localhost:3000/car' \
--header 'Content-Type: application/json' \
--data-raw '{
    "model": "someModel",
    "brand": "someBrand",
    "color": "someColor",
    "people": 5,
    "distance": 5000
}'

## Response
{
    "id": "95f0e415-7c09-4f17-b2e1-4441a63b6810",
    "color": "someColor",
    "model": "someModel",
    "brand": "someBrand",
    "people": 5,
    "distance": 5000
}
```

`PUT /car`

```
## Request
curl --location --request PUT 'localhost:3000/car' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "18b335ea-b8c0-492b-a186-0810e354aa40",
    "model": "hipNewModel"
}'

## Response
{
    "message": "Update Successful"
}
```

`GET /car` Single Car Usecase

```
## Request
curl --location --request GET 'localhost:3000/car?id=18b335ea-b8c0-492b-a186-0810e354aa40'

## Response
[
    {
        "id": "18b335ea-b8c0-492b-a186-0810e354aa40",
        "color": "someColor",
        "model": "hipNewModel",
        "brand": "someBrand",
        "people": 5,
        "distance": 5000
    }
]
```

`GET /car` All Cars Usecase

```
## Request
curl --location --request GET 'localhost:3000/car'

## Response
[
    {
        "id": "18b335ea-b8c0-492b-a186-0810e354aa40",
        "color": "someColor",
        "model": "hipNewModel",
        "brand": "someBrand",
        "people": 5,
        "distance": 5000
    },
    {
        "id": "92b335td-99r0-772b-b116-0871e388aa37",
        "color": "someColor",
        "model": "hipNewModel",
        "brand": "someBrand",
        "people": 5,
        "distance": 5000
    }
]
```

`DELETE /car` All Cars Usecase

```
## Request
curl --location --request DELETE 'localhost:3000/car' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "18b335ea-b8c0-492b-a186-0810e354aa40"
}'

## Response
{
    "message": "Deletion Successful"
}
```


## Configuration

Parts of the components behaviour can be adjusted via environment variables as listed below
  
  
| Variable                           | type    | default                                                             | description                                                                    |
|------------------------------------|---------|---------------------------------------------------------------------|--------------------------------------------------------------------------------|
| PORT                               | number  | 3001                                                                | component port                                                                 |
| LOG\_LEVEL                          | string  | info                                                                | logger log level                                                               |
| MONGODB\_URL                      | string  | 'mongodb://root:rootpassword@localhost:27017'                                            | Where to find mongoDB                             |

## Considerations
* The component is built using my current understanding of clean architecture with the separate services built in a way to make them 'plug and play'. For example, replacing the database would ideally need us to only touch a minimum number of files with everything else remaining intact.
* The tests could be extended and deduplicated to increase testing coverage
* The logger has to be extended to support additional arguments for more ease of use in multiple parts of the code
* GET, PUT and DELETE can be extended to support getting, updating and deleting multiple cars.
* Adding and passing a requestID throughout the component and logging it would be a good way to trace each request that get's into the API separately. Which would also be useful in error debugging for something running in production for example. 
* x-api-key based authentication would be nice to have
