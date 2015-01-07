# Socialight Social Analytics / Content API Usage

----------

## SOCIAL POSTS 

### GET http://api.socialight.io/posts

Required Parameters: uid, token
Permissioning for this entity is based on read token permissions for the referenced UID.

Sample Call: http://api.socialight.io/posts?token=<token>&uid=<uid>&service.name=facebook&meta.engagement_gt=.01

Returns posts from Facebook with engagement greater than one percent

``` 
  {
    "__v": 1,
    "_id": "54ab242fad67a3a02b69143a",
    "created": "2015-01-05T21:15:19.000Z",
    "engagement": {
      "comments": {
        "count": 0,
        "data": []
      },
      "likes": {
        "count": 0
      },
      "audience": {
        "followers": 1581,
        "total": 1581
      }
    },
    "meta": {
      "sentiment": 0.5,
      "engagement": 0,
      "postlength": 4,
      "density": 0.5,
      "adult": 0
    },
    "post": "Tint likes a link.",
    "service": {
      "id": "464297566935356_897147640317011",
      "sid": "464297566935356",
      "name": "facebookpage"
    },
    "type": "text",
    "uid": 767,
    "updated": "2015-01-05T23:54:23.140Z",
    "user": {
      "updated": "2015-01-05T23:54:18.354Z",
      "__v": 0,
      "_id": "544dc14efb190a322d70623e",
      "birthday": null,
      "color": "#006699",
      "created": "2014-10-27T03:51:41.913Z",
      "engagement": {
        "following": 1,
        "followers": 1581
      },
      "location": {
        "address": {
          "country": "United States",
          "zip": "94110",
          "state": "CA",
          "city": "San Francisco",
          "street": "473 Bryant St"
        },
        "place": "",
        "lng": -122.395,
        "lat": 37.781666
      },
      "name": {
        "alias": "teamtint",
        "full": "Tint",
        "last": "",
        "first": ""
      },
      "service": {
        "id": "464297566935356",
        "sid": "464297566935356",
        "name": "facebookpage"
      },
      "thumb": {
        "colors": [
          {
            "cover": null,
            "lightness": null,
            "saturation": null,
            "hue": null
          }
        ],
        "height": "",
        "width": "",
        "type": "photo",
        "caption": "",
        "thumb": "",
        "url": "http://graph.facebook.com/464297566935356/picture?type=square"
      },
      "uid": 767,
      "url": "https://www.facebook.com/teamtint",
      "topics": []
    },
    "location": [],
    "topics": [],
    "tags": [
      null
    ],
    "media": [],
    "words": [
      "likes",
      "link"
    ]
  }
```
### POST http://api.socialight.io/posts

Required Parameters: uid, token, service
Permissioning for this entity is based on read token permissions for the referenced UID.

Calls must include a service object as follows:

``` {
  name: 'facebook', 'twitter', 'instagram', or 'facebookpage',
  id: <platform post id>,
  sid: <platform account id>
} ```

## ACCOUNTS

### GET http://api.socialight.io/accounts

Required Parameters: uid, token
Permissioning for this entity is based on read token permissions for the referenced UID.

### POST http://api.socialight.io/accounts

Required Parameters: uid, token, service
Permissioning for this call is based on write token permissions for the referenced UID

Calls must include a service object as follows:

``` {
  name: 'facebook', 'twitter', 'instagram', or 'facebookpage',
  id: platform account id,
  sid: platform account id
} ```

