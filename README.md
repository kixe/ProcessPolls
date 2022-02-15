Process Polls
============

Survey and voting tool for the CMS ProcessWire

## 1. Overview

Polls or elections can be conducted in the front or back end. All templates and fields available in the backend can be used for the poll or election. Every single opinion or vote is saved as a ProcessWire page.

Any number of polls or elections can run in parallel. A period of time (date) must be determined for each election. The election is only possible in this span.

Polls via the frontend are basically anonymous, since no authentication is provided here, the data record is always saved as created by the guest user (ID=40). Polls via the backend can be either anonymous or non-anonymous. In the latter case, the respective opinion or vote can also be assigned retrospectively to the ProcessWire user who submitted it.

Polls can be token based. This guarantees that an opinion or vote is given only once. Anonymous surveys or elections are also possible here.

In the case of token-based polls or elections, the registration of the opinion or vote is stored independently of the opinion or vote itself. After the vote has been submitted, the user is shown a confirmation code (PVC = Poll Verification Code) ==once==. This confirmation code is neither stored in the database nor in a log file. However, it allows the user to identify his opinion or voice during the evaluation. To do this, the code must be copied or saved with a screenshot at the moment when it is displayed after the election. Calling up the confirmation code again is impossible.

Without the confirmation code (PVC), which only the individual user knows, it is not possible for the user himself, another user or a system administrator to subsequently associate a user to an opinion or vote.

## 2. Conditions of Participation

When configuring the poll or election, optionally a "Conditions of Participation" page can be specified. If the election takes place in the ProcessWire backend, each participant must confirm these conditions in order to be able to participate. The confirmation is stored on the device used by a cookie whose value is a date stamp. This cookie is only valid for a specific poll and the currently logged in user.

## 3. Security

### 3.1. Eligibility to Participate

The basic use of the tool or access is regulated by the 'poll-view' permission, which can be assigned to one or more roles. This must be done manually for each role after installing the module.

The authorization to participate in a specific poll or election is regulated in the configuration using a ProcessWire selector based on the user. If the user does not correspond to this selector, participation is not possible. The corresponding poll is neither listed for this user, nor is the poll platform accessible to him.

When setting up the selector, you can check which user corresponds to this selector.

### 3.2. Authorization to create, edit polls and elections

In addition to the superuser (ID=41), all users with roles assigned the 'poll-admin' permission are authorized to create, edit and delete polls and elections.

### 3.3. Election Observer

The 'poll-monitor' permission is created when the module is installed. All users with roles assigned this permission can see the administration interface but cannot edit it. In addition, the number of opinions or votes given is displayed in the list view.

### 3.4. Tokens

By default, the system-generated tokens are a 6-digit alphanumeric string. This results in about 57 billion possibilities. The constant TOKEN_LENGTH can be adjusted in the source code if necessary.

```
/**
 * TOKEN_LENGTH alphanumeric (0-9, a-z, A-Z)
 *
 * number of possible strings depending on length
 * length 5: ≈ 916,000,000 options
 * length 6: ≈ 56,800,000,000 options
 * length 7: ≈ 3,520,000,000,000 options
 *
 */
 const TOKEN_LENGTH = 6;
```

#### 3.4.1. Token List
A list with a certain number of valid tokens for a specific poll or election can be generated in the administration area. This is useful for frontend actions, e.g. if tokens are to be sent to the group of authorized persons by Email beforehand. An automatic mechanism for sending such Emails has not been implemented.

#### 3.4.2. Suto-generated Tokens

In polls or elections in the ProcessWire backend, after the authorization to participate has been checked, a token is generated and permanently linked to this user when the election list is called up. If the user then clicks on the link to vote, the token is transferred via the GET parameter and thus enables the election. Once the token has been generated, it is no longer possible for this user to use another token for the associated election.

### 3.5. Incorrect entries and attempts at manipulation

#### 3.5.1. Logged-in Users
The attempt at multiple participation, the use of a link with a token that has become invalid, an incorrect entry or attempts at manipulation are effectively ruled out once a token has been assigned to the logged-in user.

#### 3.5.2. Transmission
The transfer of a valid token from one user to another is impossible. The valid but otherwise assigned token which is used by another logged-in user will be instantly deleted and can then no longer be used by the original user.

#### 3.5.3 Unassigned Tokens
In the case of unassigned tokens (pre-generated token lists), incorrect input or attempts at manipulation are registered by the system. The maximum number of failed attempts allowed per IP-address and day (e.g. error when copying the token) is defined by the constant MAX_INVALID_ATTEMPTS and can be changed in the source code if desired.

```
/**
 * max number of attempts with invalid tokens by IP per day
 *
 */
 const MAX_INVALID_ATTEMPTS = 8;
```

#### 3.5.4. Blocking and Log
After the permitted number of manipulation attempts, the poll interface is no longer accessible. Manipulation attempts are logged with IP-address and time stamp.
The probability of guessing a token with 8 attempts can be classified as practically impossible.

## 4. Procedure of poll or election

### 4.1. front end

... *to do* ...

### 4.2. Backend
Prerequisite: The user is entitled to participate in the election or poll (see above).
After successfully logging in, the user will find the menu item: 'Polls & Elections' in the main menu. Via this link he reaches a list of current surveys and elections. By clicking on the link to a specific election, the poll or election interface is reached. The choice can be made here. The selection is completed by clicking the 'Send' button.

#### 4.2.1. Non-token-based poll or vote
If it is not a token-based poll or election, the user can return here at any time within the specified period and cast a new opinion or vote. If the poll or election is anonymous, a new vote will be generated each time. In the case of a non-anonymous survey or election, the voting can be changed in the specified period, in this case it remains a single vote.

#### 4.2.2. Token-based poll or vote
In a token-based poll or election, only one vote per user is possible. Voting is complete when the user clicks the 'Send' button and the confirmation code (see above) is displayed. In case of an error message, after correcting the entries, you can try again to vote by clicking the 'Send' button.