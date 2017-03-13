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

package dash.security;

import java.io.IOException;
import java.util.Calendar;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import dash.licensemanangement.domain.License;
import dash.licensemanangement.domain.LicenseEnum;
import dash.multitenancy.TenantContext;

public class LicenseFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		if (SecurityContextHolder.getContext().getAuthentication() != null
				&& SecurityContextHolder.getContext().getAuthentication() instanceof TenantAuthenticationToken) {
			TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext()
					.getAuthentication();
			if (TenantContext.TENANT_NOT_FOUND.equals(auth.getTenant())
					&& !LicenseEnum.ERROR.hasLicenseForUrl(request.getRequestURI())) {
				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
				filterChain.doFilter(request, response);
			}
			if (auth.getAuthenticatedTenant() != null) {
				TenantContext.setTenant(auth.getAuthenticatedTenant().getTenantKey());

				License license = auth.getAuthenticatedTenant().getLicense();

				if (!license.getLicenseType().hasLicenseForUrl(request.getRequestURI())
						|| (Calendar.getInstance().after(license.getTerm())
								&& !LicenseEnum.ERROR.hasLicenseForUrl(request.getRequestURI())
								&& !LicenseEnum.FREE.hasLicenseForUrl(request.getRequestURI()))) {
					response.setStatus(HttpServletResponse.SC_FORBIDDEN);
				}
			}
		}
		filterChain.doFilter(request, response);
	}

}
