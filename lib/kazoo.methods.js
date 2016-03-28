{
    "account": {
		"title": "Accounts",
		"get": { "verb": "GET", "url": "accounts/{accountId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}", "schemas": "schemas/accounts" },
		"update": { "verb": "POST", "url": "accounts/{accountId}", "schemas": "schemas/accounts" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}" },
		"listDescendants": { "verb": "GET", "url": "accounts/{accountId}/descendants" },
		"listChildren": { "verb": "GET", "url": "accounts/{accountId}/children" },
		"listParents": { "verb": "GET", "url": "accounts/{accountId}/tree" },
		"searchByName": { "verb": "GET", "url": "search?t=account&q=name&v={accountName}"},
		"searchAll": { "verb": "GET", "url": "search/multi?t=account&by_name={searchValue}&by_realm={searchValue}&by_id={searchValue}"},
		"promote": { "verb": "PUT", "url": "accounts/{accountId}/reseller", "schemas": "schemas/reseller" },
		"demote": { "verb": "DELETE", "url": "accounts/{accountId}/reseller" }
	},
	"appsStore": {
		"title": "App Store",
		"get": { "verb": "GET", "url": "accounts/{accountId}/apps_store/{appId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/apps_store" },
		"getIcon": { "verb": "GET", "url": "accounts/{accountId}/apps_store/{appId}/icon", "dataType": "text" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/apps_store/{appId}", "schemas": "schemas/app" },
		"add": { "verb": "PUT", "url": "accounts/{accountId}/apps_store/{appId}", "schemas": "schemas/app" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/apps_store/{appId}" },
		"getBlacklist": { "verb": "GET", "url": "accounts/{accountId}/apps_store/blacklist" },
		"updateBlacklist": { "verb": "POST", "url": "accounts/{accountId}/apps_store/blacklist", "schemas": "schemas/blacklists" }
	},
	"auth": {
		"title": "Authentication",
		"get": { "verb": "GET", "url": "accounts/{accountId}/user_auth/{token}" },
		"recovery": { "verb": "PUT", "url": "user_auth/recovery", "schemas": "schemas/user_auth" }
	},
	"balance": {
		"title": "Balance",
		"get": { "verb": "GET", "url": "accounts/{accountId}/transactions/current_balance" },
		"getMonthly": { "verb": "GET", "url": "accounts/{accountId}/transactions/monthly_recurring?created_from={from}&created_to={to}" },
		"getCharges": { "verb": "GET", "url": "accounts/{accountId}/transactions?created_from={from}&created_to={to}&reason={reason}" },
		"getSubscriptions": { "verb": "GET", "url": "accounts/{accountId}/transactions/subscriptions" },
		"filtered": { "verb": "GET", "url": "accounts/{accountId}/transactions?created_from={from}&created_to={to}&reason={reason}" },
		"add": { "verb": "PUT", "url": "accounts/{accountId}/braintree/credits", "schemas": "schemas/balance" },
		"remove": { "verb": "DELETE", "url": "accounts/{accountId}/transactions/debit"}
	},
	"billing": {
		"title": "Billing",
		"get": { "verb": "GET", "url": "accounts/{accountId}/braintree/customer" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/braintree/customer", "schemas": "schemas/billing" }
	},
	"callflow": {
		"title": "Callflows",
		"get": { "verb": "GET", "url": "accounts/{accountId}/callflows/{callflowId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/callflows", "schemas": "schemas/callflows" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/callflows/{callflowId}", "schemas": "schemas/callflows" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/callflows/{callflowId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/callflows" },
		"searchByNameAndNumber": { "verb": "GET", "url": "accounts/{accountId}/search?t=callflow&q=name_and_number&v={value}"},
		"searchByNumber": { "verb": "GET", "url": "accounts/{accountId}/search?t=callflow&q=number&v={value}"}
	},
	"cdrs": {
		"title": "CDRs",
		"get": { "verb": "GET", "url": "accounts/{accountId}/cdrs/{cdrId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/cdrs" },
		"listByUser": { "verb": "GET", "url": "accounts/{accountId}/users/{userId}/cdrs"}
	},
	"channel": {
		"title": "Channels",
		"list": { "verb": "GET", "url": "accounts/{accountId}/channels" }
	},
	"clickToCall": {
		"title": "Click to call",
		"create": { "verb": "PUT", "url": "accounts/{accountId}/clicktocall", "schemas": "schemas/clicktocall" },
		"get": { "verb": "GET",  "url": "accounts/{accountId}/clicktocall/{clickToCallId}" },
		"update": { "verb": "GET", "url": "accounts/{accountId}/clicktocall/{clickToCallId}" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/clicktocall/{clickToCallId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/clicktocall" },
		"connect": { "verb": "POST", "url": "accounts/{accountId}/clicktocall/{clickToCallId}/connect", "schemas": "schemas/connect" }
	},
	"conference": {
		"title": "Conferences",
		"get": { "verb": "GET", "url": "accounts/{accountId}/conferences/{conferenceId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/conferences", "schemas": "schemas/conferences" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/conferences/{conferenceId}", "schemas": "schemas/conferences" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/conferences/{conferenceId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/conferences" },
		"getPins": { "verb": "GET", "url": "accounts/{accountId}/conferences/pins" },
		"view": { "verb": "GET", "url": "accounts/{accountId}/conferences/{conferenceId}/status" },
		"action": { "verb": "POST", "url": "accounts/{accountId}/conferences/{conferenceId}/{action}", "schemas": "schemas/action" },

		"getServer": { "verb": "GET", "url": "accounts/{accountId}/conferences_servers/{serverId}" },
		"createServer": { "verb": "PUT", "url": "accounts/{accountId}/conferences_servers", "schemas": "schemas/server" },
		"updateServer": { "verb": "POST", "url": "accounts/{accountId}/conferences_servers/{serverId}", "schemas": "schemas/server" },
		"deleteServer": { "verb": "DELETE", "url": "accounts/{accountId}/conferences_servers/{serverId}" },
		"listServers": { "verb": "GET", "url": "accounts/{accountId}/conferences_servers" },

		"addParticipant": { "verb": "POST", "url": "accounts/{accountId}/conferences/{conferenceId}/add_participant", "schemas": "schemas/participant" },
		"muteParticipant": { "verb": "POST", "url": "accounts/{accountId}/conferences/{conferenceId}/mute/{participantId}" },
		"unmuteParticipant": { "verb": "POST", "url": "accounts/{accountId}/conferences/{conferenceId}/unmute/{participantId}" },
		"deafParticipant": { "verb": "POST", "url": "accounts/{accountId}/conferences/{conferenceId}/deaf/{participantId}" },
		"undeafParticipant": { "verb": "POST", "url": "accounts/{accountId}/conferences/{conferenceId}/undeaf/{participantId}" },
		"kickParticipant": { "verb": "POST", "url": "accounts/{accountId}/conferences/{conferenceId}/kick/{participantId}" },

		"createNotification": { "verb": "PUT", "url": "accounts/{accountId}/notify/conference_{notificationType}", "type": "text/html", "dataType": "text/html", "schemas": "schemas/notifications" },
		"getNotification": { "verb": "GET", "url": "accounts/{accountId}/notify/conference_{notificationType}/{contentType}", "type": "text/html", "dataType": "text/html" },
		"updateNotification": { "verb": "POST", "url": "accounts/{accountId}/notify/conference_{notificationType}", "type": "text/html", "dataType": "text/html", "schemas": "schemas/notifications" }
	},
	"connectivity": {
		"title": "Connectivity",
		"get": { "verb": "GET", "url": "accounts/{accountId}/connectivity/{connectivityId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/connectivity", "schemas": "schemas/connectivity" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/connectivity/{connectivityId}", "schemas": "schemas/connectivity" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/connectivity" }
	},
	"contactList": {
		"title": "Contact list",
		"get": { "verb": "GET", "url": "accounts/{accountId}/contact_list" }
	},
	"device": {
		"title": "Devices",
		"get": { "verb": "GET", "url": "accounts/{accountId}/devices/{deviceId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/devices", "schemas": "schemas/devices" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/devices/{deviceId}", "schemas": "schemas/devices" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/devices/{deviceId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/devices" },
		"getStatus": { "verb": "GET", "url": "accounts/{accountId}/devices/status" },
		"quickcall": { "verb": "GET", "url": "accounts/{accountId}/devices/{deviceId}/quickcall/{number}"},
		"restart": { "verb": "POST", "url": "accounts/{accountId}/devices/{deviceId}/sync"},
		"updatePresence": { "verb": "POST", "url": "accounts/{accountId}/device/{deviceId}/presence", "schemas": "schemas/presence" }
	},
	"directory": {
		"title": "Directories",
		"get": { "verb": "GET", "url": "accounts/{accountId}/directories/{directoryId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/directories", "schemas": "schemas/directories" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/directories/{directoryId}", "schemas": "schemas/directories" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/directories/{directoryId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/directories" }
	},
	"faxbox": {
		"title": "Faxbox",
		"get": { "verb": "GET", "url": "accounts/{accountId}/faxboxes/{faxboxId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/faxboxes/", "schemas": "schemas/faxbox" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/faxboxes/{faxboxId}", "schemas": "schemas/faxbox" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/faxboxes/{faxboxId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/faxboxes/" }
	},
	"faxes": {
		"title": "Faxes",
		"getLogs": { "verb": "GET", "url": "accounts/{accountId}/faxes/smtplog"},
		"getLogDetails": { "verb": "GET", "url": "accounts/{accountId}/faxes/smtplog/{logId}"}
	},
	"globalResources": {
		"title": "Global resources",
		"get": { "verb": "GET", "url": "resources/{resourceId}" },
		"create": { "verb": "PUT", "url": "resources", "schemas": "schemas/resources" },
		"update": { "verb": "POST", "url": "resources/{resourceId}", "schemas": "schemas/resources" },
		"delete": { "verb": "DELETE", "url": "resources/{resourceId}" },
		"list": { "verb": "GET", "url": "resources" },
		"updateCollection": { "verb": "POST", "url": "resources/collection" },
		"listJobs": { "verb": "GET", "url": "resources/jobs" },
		"getJob": { "verb": "GET", "url": "resources/jobs/{jobId}" },
		"createJob":  { "verb": "PUT", "url": "resources/jobs", "schemas": "schemas/resource_jobs" }
	},
	"group": {
		"title": "Groups",
		"get": { "verb": "GET", "url": "accounts/{accountId}/groups/{groupId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/groups", "schemas": "schemas/groups" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/groups/{groupId}", "schemas": "schemas/groups" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/groups/{groupId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/groups" }
	},
	"inspector": {
		"title": "Inspector",
		"get": { "verb": "GET", "url": "accounts/{accountId}/call_inspector/{callId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/call_inspector" }
	},
	"ips": {
		"title": "IPS",
		"add": { "verb": "POST", "url": "accounts/{accountId}/ips/{ip}" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/ips/{ip}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/ips?zone={zone}&quantity={quantity}" },
		"listAssigned": { "verb": "GET", "url": "accounts/{accountId}/ips/assigned" },
		"listZones": { "verb": "GET", "url": "accounts/{accountId}/ips/zones" }
	},
	"limits": {
		"title": "Limits",
		"get": { "verb": "GET", "url": "accounts/{accountId}/limits" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/limits", "schemas": "schemas/limits" }
	},
	"localResources": {
		"title": "Local resources",
		"get": { "verb": "GET", "url": "accounts/{accountId}/resources/{resourceId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/resources", "schemas": "schemas/resources" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/resources/{resourceId}", "schemas": "schemas/resources" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/resources/{resourceId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/resources" },
		"updateCollection": { "verb": "POST", "url": "accounts/{accountId}/resources/collection" },
		"listJobs": { "verb": "GET", "url": "accounts/{accountId}/resources/jobs" },
		"getJob": { "verb": "GET", "url": "accounts/{accountId}/resources/jobs/{jobId}" },
		"createJob":  { "verb": "PUT", "url": "accounts/{accountId}/resources/jobs", "schemas": "schemas/resource_jobs" }
	},
	"media": {
		"title": "Media",
		"get": { "verb": "GET", "url": "accounts/{accountId}/media/{mediaId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/media", "schemas": "schemas/media" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/media/{mediaId}", "schemas": "schemas/media" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/media/{mediaId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/media" },
		"upload": { "verb": "POST", "url": "accounts/{accountId}/media/{mediaId}/raw", "type": "application/x-base64" }
	},
	"menu": {
		"title": "Menus",
		"get": { "verb": "GET", "url": "accounts/{accountId}/menus/{menuId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/menus", "schemas": "schemas/menus" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/menus/{menuId}", "schemas": "schemas/menus" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/menus/{menuId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/menus" }
	},
	"numbers": {
		"title": "Numbers",
		"get": { "verb": "GET", "url": "accounts/{accountId}/phone_numbers/{phoneNumber}" },
		"activate": { "verb": "PUT", "url": "accounts/{accountId}/phone_numbers/{phoneNumber}/activate" },
		"activateBlock": { "verb": "PUT", "url": "accounts/{accountId}/phone_numbers/collection/activate" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/phone_numbers/{phoneNumber}", "schemas": "schemas/phone_numbers" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/phone_numbers/{phoneNumber}" },
		"deleteBlock": { "verb": "DELETE", "url": "accounts/{accountId}/phone_numbers/collection" },
		"identify": { "verb": "GET", "url": "accounts/{accountId}/phone_numbers/{phoneNumber}/identify" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/phone_numbers?filter_state=in_service" },
		"listAll": { "verb": "GET", "url": "accounts/{accountId}/phone_numbers" },
		"listClassifiers": { "verb": "GET", "url": "accounts/{accountId}/phone_numbers/classifiers" },
		"matchClassifier": { "verb": "GET", "url": "accounts/{accountId}/phone_numbers/classifiers/{phoneNumber}" },
		"search": { "verb": "GET", "url": "phone_numbers?prefix={pattern}&quantity={limit}&offset={offset}" },
		"searchBlocks": { "verb": "GET", "url": "phone_numbers?prefix={pattern}&quantity={size}&offset={offset}&blocks={limit}" },
		"searchCity": { "verb": "GET", "url": "phone_numbers/prefix?city={city}" },
		"sync": { "verb": "POST", "url": "accounts/{accountId}/phone_numbers/fix" }
	},
	"pivot": {
		"title": "Pivot",
		"listDebug": { "verb": "GET", "url": "accounts/{accountId}/pivot/debug" },
		"getDebug": { "verb": "GET", "url": "accounts/{accountId}/pivot/debug/{callId}" }
	},
	"port": {
		"title": "Port",
		"get": { "verb": "GET", "url": "accounts/{accountId}/port_requests/{portRequestId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/port_requests", "schemas": "schemas/port_requests" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/port_requests/{portRequestId}", "schemas": "schemas/port_requests" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/port_requests/{portRequestId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/port_requests" },
		"listByState": { "verb": "GET", "url": "accounts/{accountId}/port_requests/{state}" },
		"listDescendants": { "verb": "GET", "url": "accounts/{accountId}/descendants/port_requests" },
		"listDescendantsByState": { "verb": "GET", "url": "accounts/{accountId}/descendants/port_requests/{state}" },
		"listAttachments": { "verb": "GET", "url": "accounts/{accountId}/port_requests/{portRequestId}/attachments" },
		"getAttachment": { "verb": "GET", "url": "accounts/{accountId}/port_requests/{portRequestId}/attachments/{documentName}", "type": "application/pdf" },
		"createAttachment": { "verb": "PUT", "url": "accounts/{accountId}/port_requests/{portRequestId}/attachments?filename={documentName}", "type": "application/pdf" },
		"updateAttachment": { "verb": "POST", "url": "accounts/{accountId}/port_requests/{portRequestId}/attachments/{documentName}", "type": "application/pdf" },
		"deleteAttachment": { "verb": "DELETE", "url": "accounts/{accountId}/port_requests/{portRequestId}/attachments/{documentName}", "type": "application/pdf" },
		"changeState": { "verb": "PATCH", "url": "accounts/{accountId}/port_requests/{portRequestId}/{state}" },
		"listComments": { "verb": "GET", "url": "accounts/{accountId}/port_requests/{portRequestId}/comments" },
		"getComment": { "verb": "GET", "url": "accounts/{accountId}/port_requests/{portRequestId}/comments/{commentId}" },
		"addComment": { "verb": "PUT", "url": "accounts/{accountId}/port_requests/{portRequestId}/comments" },
		"updateComment": { "verb": "POST", "url": "accounts/{accountId}/port_requests/{portRequestId}/comments/{commentId}" },
		"deleteComment": { "verb": "DELETE", "url": "accounts/{accountId}/port_requests/{portRequestId}/comments/{commentId}" },
		"deleteAllComments": { "verb": "DELETE", "url": "accounts/{accountId}/port_requests/{portRequestId}/comments" },
		"searchNumber": { "verb": "GET", "url": "accounts/{accountId}/port_requests?by_number={number}" },
		"searchNumberByDescendants": { "verb": "GET", "url": "accounts/{accountId}/descendants/port_requests?by_number={number}" }
	},
	"presence": {
		"title": "Presence",
		"list": { "verb": "GET", "url": "accounts/{accountId}/presence" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/presence/{presenceId}", "schemas": "schemas/presence" }
	},
	"registrations": {
		"title": "Registrations",
		"list": { "verb": "GET", "url": "accounts/{accountId}/registrations" }
	},
	"resourceTemplates": {
		"title": "Resource templates",
		"get": { "verb": "GET", "url": "accounts/{accountId}/resource_templates/{resourceId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/resource_templates", "schemas": "schemas/resources" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/resource_templates/{resourceId}", "schemas": "schemas/resources" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/resource_templates/{resourceId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/resource_templates" }
	},
	"servicePlan": {
		"title": "Service plan",
		"get": { "verb": "GET", "url": "accounts/{accountId}/service_plans/{planId}" },
		"add": { "verb": "POST", "url": "accounts/{accountId}/service_plans/{planId}", "schemas": "schemas/service_plans" },
		"addMany": { "verb": "POST", "url": "accounts/{accountId}/service_plans/" },
		"remove": { "verb": "DELETE", "url": "accounts/{accountId}/service_plans/{planId}" },
		"removeMany": { "verb": "DELETE", "url": "accounts/{accountId}/service_plans/" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/service_plans/", "schemas": "schemas/service_plans" },
		"addManyOverrides": { "verb": "POST", "url": "accounts/{accountId}/service_plans/override" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/service_plans" },
		"listCurrent": { "verb": "GET", "url": "accounts/{accountId}/service_plans/current" },
		"getCsv": { "verb": "GET", "url": "accounts/{accountId}/service_plans/current?depth=4&identifier=items&accept=csv" },
		"listAvailable": { "verb": "GET", "url": "accounts/{accountId}/service_plans/available" },
		"getAvailable": { "verb": "GET", "url": "accounts/{accountId}/service_plans/available/{planId}" },
		"reconciliate": { "verb": "POST", "url": "accounts/{accountId}/service_plans/reconciliation" },
		"synchronize": { "verb": "POST", "url": "accounts/{accountId}/service_plans/synchronization" }
	},
	"temporalRule": {
		"title": "Temporal rules",
		"get": { "verb": "GET", "url": "accounts/{accountId}/temporal_rules/{ruleId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/temporal_rules", "schemas": "schemas/temporal_rules" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/temporal_rules/{ruleId}", "schemas": "schemas/temporal_rules"},
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/temporal_rules/{ruleId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/temporal_rules" }
	},
	"temporalSet": {
		"title": "Temporal sets",
		"get": { "verb": "GET", "url": "accounts/{accountId}/temporal_rules_sets/{setId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/temporal_rules_sets", "schemas": "schemas/temporal_rules_sets" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/temporal_rules_sets/{setId}", "schemas": "schemas/temporal_rules_sets" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/temporal_rules_sets/{setId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/temporal_rules_sets" }
	},
	"user": {
		"title": "Users",
		"get": { "verb": "GET", "url": "accounts/{accountId}/users/{userId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/users", "schemas": "schemas/users" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/users/{userId}", "schemas": "schemas/users" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/users/{userId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/users" },
		"quickcall": { "verb": "GET", "url": "accounts/{accountId}/users/{userId}/quickcall/{number}"},
		"hotdesks": { "verb": "GET", "url": "accounts/{accountId}/users/{userId}/hotdesks" },
		"updatePresence": { "verb": "POST", "url": "accounts/{accountId}/users/{userId}/presence", "schemas": "schemas/presense" }
	},
	"voicemail": {
		"title": "Vmboxes",
		"get": { "verb": "GET", "url": "accounts/{accountId}/vmboxes/{voicemailId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/vmboxes", "schemas": "schemas/vmboxes" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/vmboxes/{voicemailId}", "schemas": "schemas/vmboxes" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/vmboxes/{voicemailId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/vmboxes" }
	},
	"webhooks": {
		"title": "Webhooks",
		"get": { "verb": "GET", "url": "accounts/{accountId}/webhooks/{webhookId}" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/webhooks", "schemas": "schemas/webhooks" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/webhooks/{webhookId}", "schemas": "schemas/webhooks" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/webhooks/{webhookId}" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/webhooks" },
		"listAccountAttempts": { "verb": "GET", "url": "accounts/{accountId}/webhooks/attempts" },
		"listAttempts": { "verb": "GET", "url": "accounts/{accountId}/webhooks/{webhookId}/attempts" },
		"listAvailable": { "verb": "GET", "url": "webhooks" },
		"patch": { "verb": "PATCH", "url": "accounts/{accountId}/webhooks/{webhookId}", "schemas": "schemas/webhooks" },
		"patchAll": { "verb": "PATCH", "url": "accounts/{accountId}/webhooks" }
	},
	"websockets": {
		"title": "Websockets",
		"listEvents": { "verb": "GET", "url": "websockets" },
		"list": { "verb": "GET", "url": "accounts/{accountId}/websockets" },
		"listBindings": { "verb": "GET", "url": "accounts/{accountId}/websockets/{websocketId}" }
	},
	"whitelabel": {
		"title": "Whitelabel",
		"getByDomain": { "verb": "GET", "url": "whitelabel/{domain}" },
		"getLogoByDomain": { "verb": "GET", "url": "whitelabel/{domain}/logo" },
		"getIconByDomain": { "verb": "GET", "url": "whitelabel/{domain}/icon" },
		"getWelcomeByDomain": { "verb": "GET", "url": "whitelabel/{domain}/welcome", "type": "text/html", "dataType": "html" },
		"get": { "verb": "GET", "url": "accounts/{accountId}/whitelabel" },
		"getLogo": { "verb": "GET", "url": "accounts/{accountId}/whitelabel/logo" },
		"getIcon": { "verb": "GET", "url": "accounts/{accountId}/whitelabel/icon" },
		"getWelcome": { "verb": "GET", "url": "accounts/{accountId}/whitelabel/welcome", "type": "text/html", "dataType": "html" },
		"update": { "verb": "POST", "url": "accounts/{accountId}/whitelabel", "schemas": "schemas/whitelabels" },
		"updateLogo": { "verb": "POST", "url": "accounts/{accountId}/whitelabel/logo", "type": "application/x-base64" },
		"updateIcon": { "verb": "POST", "url": "accounts/{accountId}/whitelabel/icon", "type": "application/x-base64" },
		"updateWelcome": { "verb": "POST", "url": "accounts/{accountId}/whitelabel/welcome", "type": "text/html", "dataType": "html" },
		"create": { "verb": "PUT", "url": "accounts/{accountId}/whitelabel", "schemas": "schemas/whitelabels" },
		"delete": { "verb": "DELETE", "url": "accounts/{accountId}/whitelabel" },
		"listNotifications": { "verb": "GET", "url": "accounts/{accountId}/notifications" },
		"getNotification": { "verb": "GET", "url": "accounts/{accountId}/notifications/{notificationId}" },
		"getNotificationText": { "verb": "GET", "url": "accounts/{accountId}/notifications/{notificationId}", "type": "text/plain", "dataType": "text" },
		"getNotificationHtml": { "verb": "GET", "url": "accounts/{accountId}/notifications/{notificationId}", "type": "text/html", "dataType": "html" },
		"updateNotification": { "verb": "POST", "url": "accounts/{accountId}/notifications/{notificationId}", "schemas": "schemas/notifications" },
		"updateNotificationText": { "verb": "POST", "url": "accounts/{accountId}/notifications/{notificationId}", "schemas": "schemas/notifications", "type": "text/plain", "dataType": "text" },
		"updateNotificationHtml": { "verb": "POST", "url": "accounts/{accountId}/notifications/{notificationId}", "schemas": "schemas/notifications", "type": "text/html", "dataType": "html" },
		"previewNotification": { "verb": "POST", "url": "accounts/{accountId}/notifications/{notificationId}/preview" },
		"deleteNotification": { "verb": "DELETE", "url": "accounts/{accountId}/notifications/{notificationId}" },
		"getDnsEntries": { "verb": "GET", "url": "accounts/{accountId}/whitelabel/domains" },
		"checkDnsEntries": { "verb": "POST", "url": "accounts/{accountId}/whitelabel/domains?domain={domain}" }
	}
}