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
package dash.leadmanagement.rest.test;

import static org.junit.Assert.assertEquals;

import org.apache.http.entity.ContentType;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import dash.Application;
import dash.containermanagement.domain.Container;
import dash.inquirermanagement.domain.Inquirer;
import dash.inquirermanagement.domain.Title;
import dash.leadmanagement.domain.Lead;
import dash.test.BaseConfig;
import dash.vendormanagement.domain.Vendor;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(Application.class)
@WebIntegrationTest
public class LeadIntegrationTest extends BaseConfig {

	private static final String EXTENDED_URI = BASE_URI + "/api/rest/processes/leads";

	@Before
	public void setup() {
		headers.clear();
		headers.add("Authorization", "Basic " + base64Creds);
		headers.setContentType(MediaType.APPLICATION_JSON);
	}

	@Test
	public void postLead() {
		Lead lead = createLead();
		HttpEntity<Lead> entity = new HttpEntity<Lead>(lead, headers);

		ResponseEntity<Lead> response = restTemplate.exchange(EXTENDED_URI, HttpMethod.POST, entity, Lead.class);
		Lead responseLead = response.getBody();

		assertEquals(ContentType.APPLICATION_JSON.getCharset(), response.getHeaders().getContentType().getCharSet());
		assertEquals(HttpStatus.CREATED, response.getStatusCode());
		assertEquals(lead, responseLead);
	}

	@Test
	public void getLead() {
		HttpEntity<Lead> entityCreateLead = new HttpEntity<Lead>(createLead(), headers);

		ResponseEntity<Lead> responseCreate = restTemplate.exchange(EXTENDED_URI, HttpMethod.POST, entityCreateLead, Lead.class);
		Lead responseCreateLead = responseCreate.getBody();

		HttpEntity<Lead> entityGetLead = new HttpEntity<Lead>(headers);

		ResponseEntity<Lead> responseGetLead = restTemplate.exchange(EXTENDED_URI + "/{id}", HttpMethod.GET, entityGetLead, Lead.class,
				responseCreateLead.getId());

		assertEquals(ContentType.APPLICATION_JSON.getCharset(), responseGetLead.getHeaders().getContentType().getCharSet());
		assertEquals(HttpStatus.OK, responseGetLead.getStatusCode());
		assertEquals(createLead(), responseGetLead.getBody());
	}

	private Lead createLead() {

		Inquirer inquirer = new Inquirer();
		inquirer.setFirstname("Max");
		inquirer.setLastname("Mustermann");
		inquirer.setCompany("Einkauf Mustermann GmbH");
		inquirer.setEmail("max.mustermann@einkauf-mustermann.de");
		inquirer.setPhone("07961/55166");
		inquirer.setTitle(Title.MR);

		Vendor vendor = new Vendor();
		vendor.setName("Karl Neu 2");
		vendor.setPhone("0761331234");

		Container container = new Container();
		container.setName("K�hlcontainer");
		container.setDescription("Dieser K�hlcontainer k�hlt am aller besten");
		container.setPriceNetto(1000.00);

		Lead lead = new Lead();
		lead.setInquirer(inquirer);
		lead.setVendor(vendor);
		lead.setContainer(container);
		lead.setContainerAmount(30);
		lead.setMessage("Test Anfrage");
		lead.setDestination("Karlsruhe");

		return lead;
	}

	@Test
	public void updateLead() {

		Lead lead = createLead();
		HttpEntity<Lead> entityCreateLead = new HttpEntity<Lead>(lead, headers);

		ResponseEntity<Lead> responseCreate = restTemplate.exchange(EXTENDED_URI, HttpMethod.POST, entityCreateLead, Lead.class);
		Lead responseCreateLead = responseCreate.getBody();

		lead.setContainerAmount(10);
		HttpEntity<Lead> entity = new HttpEntity<Lead>(lead, headers);

		ResponseEntity<Lead> response = restTemplate.exchange(EXTENDED_URI + "/{id}", HttpMethod.PUT, entity, Lead.class, responseCreateLead.getId());
		Lead responseLead = response.getBody();

		assertEquals(ContentType.APPLICATION_JSON.getCharset(), response.getHeaders().getContentType().getCharSet());
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(lead, responseLead);
	}
}