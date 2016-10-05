# Permissions Matrix

| Action |  |  |  |  |  |  |  |  |  |  |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| __Managing users__ |  System admin | Account manager | Account publisher | Account editor | Account previewer | Account member | Entry manager | Entry publisher | Entry editor | Entry previewer |
| Invite users | X | A |  |  |  |  |  |  |  |  |
| Edit/delete users | X | O | O | O | O | O | O | O | O | O |
| Suspend users | X |  |  |  |  |  |  |  |  |  |
| Set/unset admin role | X |  |  |  |  |  |  |  |  |  |
| Set/edit roles on accounts | X | A |  |  |  |  |  |  |  |  |
| Set/edit roles on entries | X | A |  |  |  |  | E |  |  |  |
| Receive roles on entries of account | X | A | A | A | A | A |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |
| __Managing settings__ | System admin | Account manager | Account publisher | Account editor | Account previewer | Account member | Entry manager | Entry publisher | Entry editor | Entry previewer |
| System settings | X |  |  |  |  |  |  |  |  |  |
| Account settings* | X | A |  |  |  |  |  |  |  |  |
| Account/entry settings** | X | A | A |  |  |  |  |  |  |  |
| Entry settings*** | X | A | A |  |  |  | E | E |  |  |
|  |  |  |  |  |  |  |  |  |  |  |
| __Managing accounts__ | System admin | Account manager | Account publisher | Account editor | Account previewer | Account member | Entry manager | Entry publisher | Entry editor | Entry previewer |
| Create/delete accounts | X |  |  |  |  |  |  |  |  |  |
| Manage folders | X | A | A |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |
| __Managing entries__ | System admin | Account manager | Account publisher | Account editor | Account previewer | Account member | Entry manager | Entry publisher | Entry editor | Entry previewer |
| List all entries | X |  |  |  |  |  |  |  |  |  |
| Delete entries | X | A |  |  |  |  |  |  |  |  |
| Create entries, move entries between folders | X | A | A |  |  |  |  |  |  |  |
| Publish/depublish/duplicate entries | X | A | A |  |  |  | E | E |  |  |
| Edit entries | X | A | A | A |  |  | E | E | E |  |
| Preview entries/revisions | X | A | A | A | A |  | E | E | E | E |

Key: X = for all, A = on respective account, E = on respective entry, O = on own profile

*) Account settings: feature configuration, indexing widgets, set default theming

**) Account/entry settings: set account on entry

***) Entry settings: web beacons/widgets functionality
