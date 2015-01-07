# Socialight Social Analytics / Content API Usage

----------

## SOCIAL POSTS 

### GET http://api.socialight.io/posts

Required Parameters: uid, token
Permissioning for this entity is based on read token permissions for the referenced UID.

Sample Call: http://api.socialight.io/posts?token=<token>&uid=<uid>&service.name=facebook&meta.engagement_gt=.01

Returns posts from Facebook with engagement greater than one percent

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

