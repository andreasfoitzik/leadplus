/*******************************************************************************
 * Copyright (c) 2016 Eviarc GmbH.
 * All rights reserved.  
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Eviarc GmbH and its suppliers, if any.  
 * The intellectual and technical concepts contained
 * herein are proprietary to Eviarc GmbH,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Eviarc GmbH.
 *******************************************************************************/
package dash.messagemanagement.domain;

import java.util.Set;

import dash.notificationmanagement.domain.Attachment;
import dash.notificationmanagement.domain.NotificationType;

public class EmailMessage extends AbstractMessage {

	/**
	 * @param recipient
	 *            - guy who receives this Message
	 * @param subject
	 *            - subject of this specific Message
	 * @param content
	 *            - content of this specific Message
	 * @param attachment
	 *            - attachment of this specific Message
	 */
	public EmailMessage(String recipient, String subject, String content, Set<Attachment> attachments,
			NotificationType notificationType) {
		super(recipient, subject, content, attachments, notificationType);
	}
}