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

package dash.processmanagement.business;

import static dash.Constants.PROCESS_NOT_FOUND;
import static dash.Constants.USER_NOT_FOUND;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dash.exceptions.NotFoundException;
import dash.exceptions.SaveFailedException;
import dash.leadmanagement.business.LeadService;
import dash.leadmanagement.domain.Lead;
import dash.offermanagement.business.OfferService;
import dash.offermanagement.domain.Offer;
import dash.processmanagement.domain.Process;
import dash.processmanagement.domain.Status;
import dash.processmanagement.domain.Workflow;
import dash.salemanagement.business.SaleService;
import dash.salemanagement.domain.Sale;
import dash.usermanagement.business.UserService;
import dash.usermanagement.domain.User;

@Service
public class ProcessService implements IProcessService {

	@Autowired
	private ProcessRepository processRepository;

	@Autowired
	private UserService userService;

	@Autowired
	private LeadService leadService;

	@Autowired
	private OfferService offerService;

	@Autowired
	private SaleService saleService;

	@Override
	public List<Object> getElementsByStatus(Status status, Workflow workflow) {

		List<Process> processes = processRepository.findProcessesByStatus(status);
		List<Object> elements = new ArrayList<>();

		if (workflow == Workflow.LEAD) {
			for (Process process : processes) {
				elements.add(process.getLead());
			}
		} else if (workflow == Workflow.OFFER) {
			for (Process process : processes) {
				elements.add(process.getOffer());
			}
		} else if (workflow == Workflow.SALE) {
			for (Process process : processes) {
				elements.add(process.getSale());
			}
		}

		return elements;
	}

	@Override
	public void saveProcesses(List<Process> processes) throws SaveFailedException, NotFoundException {
		for (Process process : processes) {
			if (Optional.ofNullable(process.getLead()).isPresent())
				leadService.save(process.getLead());
			if (Optional.ofNullable(process.getOffer()).isPresent())
				offerService.save(process.getOffer());
			if (Optional.ofNullable(process.getSale()).isPresent()) {
				process.setProcessor(userService.getUserByName("admin"));
				saleService.save(process.getSale());
			}

			processRepository.save(process);
		}
	}

	@Override
	public Process save(final Process process) throws SaveFailedException, NotFoundException {
		Process createdProcess = null;
		if (Optional.ofNullable(process).isPresent()) {
			if (Optional.ofNullable(process.getProcessor()).isPresent()) {
				if (!Optional.ofNullable(userService.getUserByName(process.getProcessor().getUsername())).isPresent()) {
					userService.save(process.getProcessor());
				}
			}
			if (Optional.ofNullable(process.getLead()).isPresent())
				leadService.save(process.getLead());

			if (Optional.ofNullable(process.getOffer()).isPresent())
				offerService.save(process.getOffer());

			if (Optional.ofNullable(process.getSale()).isPresent())
				saleService.save(process.getSale());

			createdProcess = processRepository.save(process);
		}
		return createdProcess;
	}

	@Override
	public Lead createLead(Long processId, Lead lead) throws NotFoundException, SaveFailedException {
		Process process = processRepository.findOne(processId);
		Lead createdLead;
		if (Optional.ofNullable(process).isPresent()) {
			createdLead = leadService.save(lead);
			process.setLead(lead);
			processRepository.save(process);
		} else {
			throw new NotFoundException(PROCESS_NOT_FOUND);
		}
		return createdLead;
	}

	@Override
	public Offer createOffer(Long processId, Offer offer) throws NotFoundException, SaveFailedException {
		Process process = processRepository.findOne(processId);
		Offer createdOffer;
		if (Optional.ofNullable(process).isPresent()) {
			createdOffer = offerService.save(offer);
			process.setOffer(offer);
			processRepository.save(process);
		} else {
			throw new NotFoundException(PROCESS_NOT_FOUND);
		}
		return createdOffer;
	}

	@Override
	public Sale createSale(Long processId, Sale sale) throws NotFoundException, SaveFailedException {
		Process process = processRepository.findOne(processId);
		Sale createdSale;
		if (Optional.ofNullable(process).isPresent()) {
			createdSale = saleService.save(sale);
			process.setSale(sale);
			processRepository.save(process);
		} else {
			throw new NotFoundException(PROCESS_NOT_FOUND);
		}
		return createdSale;
	}

	@Override
	public User setProcessor(Long processId, String username) throws NotFoundException {
		Process process = processRepository.findOne(processId);
		final User processor = userService.getUserByName(username);
		if (!Optional.ofNullable(process).isPresent())
			throw new NotFoundException(PROCESS_NOT_FOUND);
		if (!Optional.ofNullable(processor).isPresent())
			throw new NotFoundException(USER_NOT_FOUND);
		if (!Optional.ofNullable(process.getProcessor()).isPresent()) {
			process.setProcessor(processor);
			processRepository.save(process);
		}
		return processor;
	}

	@Override
	public Status updateStatus(Long processId, Status status) throws NotFoundException {
		Process process = processRepository.findOne(processId);
		if (Optional.ofNullable(process).isPresent()) {
			process.setStatus(status);
			processRepository.save(process);
		} else {
			throw new NotFoundException(PROCESS_NOT_FOUND);
		}

		return status;
	}

	@Override
	public Process update(final Process updateProcess) throws NotFoundException {
		Process process = processRepository.findOne(updateProcess.getId());
		if (Optional.ofNullable(process).isPresent()) {
			process.setLead(updateProcess.getLead());
			process.setOffer(updateProcess.getOffer());
			process.setSale(updateProcess.getSale());
			process.setStatus(updateProcess.getStatus());
			process.setProcessor(updateProcess.getProcessor());
			return processRepository.save(process);
		} else {
			throw new NotFoundException(PROCESS_NOT_FOUND);
		}

	}

	@Override
	public List<Process> getProcessWithLatestSales(int amount) {
		// TODO Auto-generated method stub
		return null;
	}
}
