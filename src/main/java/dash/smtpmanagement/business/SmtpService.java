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

package dash.smtpmanagement.business;

import javax.mail.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import dash.common.EncryptionWrapper;
import dash.common.Encryptor;
import dash.exceptions.NotFoundException;
import dash.notificationmanagement.business.NotificationUtil;
import dash.notificationmanagement.domain.Notification;
import dash.security.business.ISecurityService;
import dash.security.jwt.domain.UserContext;
import dash.smtpmanagement.domain.Smtp;
import dash.smtpmanagement.domain.SmtpEncryptionType;

@Service
public class SmtpService implements ISmtpService {

	@Autowired
	private SmtpRepository smtpRepository;

	private ISecurityService securityService;

	public SmtpService(ISecurityService securtiyService) {
		this.securityService = securtiyService;
	}

	@Override
	public Smtp test(final Long smtpId) throws Exception {

		Smtp smtp = this.smtpRepository.findOne(smtpId);
		if (smtp == null)
			throw new NotFoundException("There is no SMTP-Server Configuration for specified id.");

		smtp.setVerified(false);
		// SMTP-Access
		String username = smtp.getUsername();
		String emailFrom = smtp.getEmail();
		String senderName = smtp.getSender();
		SmtpEncryptionType smtpEncryptionType = smtp.getEncryption();
		String password;

		// SMTP-Server
		String host = smtp.getHost();
		int port = smtp.getPort();

		// SMTP-Session
		Session session;

		Notification notification;

		password = SmtpUtil.decryptPasswordForSmtp(smtp);
		session = SmtpUtil.createSessionWithAuthentication(host, port, smtpEncryptionType, username, password);
		notification = NotificationUtil.createTestNotification(smtp.getEmail(), smtp.getSender());
		Smtp tempSmtp = null;
		try {
			if (smtpEncryptionType == SmtpEncryptionType.PLAIN) {
				NotificationUtil.plainTransport(session, notification, emailFrom, senderName, host, port, username,
						password);
			} else if (smtpEncryptionType == SmtpEncryptionType.TLS || smtpEncryptionType == SmtpEncryptionType.SSL
					|| smtpEncryptionType == SmtpEncryptionType.STARTTLS) {
				NotificationUtil.secureTransport(session, notification, emailFrom, senderName, host, port, username,
						password);
			}
			smtp.setVerified(true);

		} finally {

			tempSmtp = save(smtp, null);
		}
		return tempSmtp;
	}

	@Override
	public Smtp save(final Smtp smtp, String smtpKey) throws Exception {

		if (smtp != null && smtp.getId() != null
				&& (smtp.getPassword() == null || new String(smtp.getPassword(), "UTF-8") == "")) {
			Smtp tempSmpt = smtpRepository.findOne(smtp.getId());
			smtp.setPassword(tempSmpt.getPassword());
			smtp.setSalt(tempSmpt.getSalt());
			smtp.setIv(tempSmpt.getIv());
		} else if (smtp != null && smtp.isDecrypted() == true && smtp.getPassword() != null
				&& new String(smtp.getPassword(), "UTF-8") != "") {
			if (smtpKey == null) {
				Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
				UserContext userContext = (UserContext) authentication.getPrincipal();
				smtpKey = userContext.getSmtpKey();
			}

			EncryptionWrapper encryptionWrapper = Encryptor.encrypt(smtp.getPassword(), smtpKey);
			smtp.setPassword(encryptionWrapper.getCiphertext());
			smtp.setSalt(encryptionWrapper.getSalt());
			smtp.setIv(encryptionWrapper.getIv());
		}
		return smtpRepository.save(smtp);
	}

	@Override
	public Smtp findByUserId(final long userId) {
		try {
			return smtpRepository.findByUserId(userId);
		} catch (NotFoundException e) {
			return null;
		}
	}

	@Override
	public Smtp findByAuthenticatedUser() throws NotFoundException {
		return smtpRepository.findByUserUsername(this.securityService.getAuthenticatedUser());
	}

}
