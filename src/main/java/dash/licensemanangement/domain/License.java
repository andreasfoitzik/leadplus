package dash.licensemanangement.domain;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "license", schema = "public")
public class License {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "license_auto_gen")
	@SequenceGenerator(name = "license_auto_gen", sequenceName = "public.license_id_seq", allocationSize = 1)
	@Column(name = "id", nullable = false)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private LicenseEnum licenseType;

	@Column
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd.MM.yyyy HH:mm")
	private Calendar term;

	private boolean trial;

	public License() {

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LicenseEnum getLicenseType() {
		return licenseType;
	}

	public void setLicenseType(LicenseEnum license) {
		this.licenseType = license;
	}

	public Calendar getTerm() {
		return term;
	}

	public void setTerm(Calendar term) {
		this.term = term;
	}

	public boolean isTrial() {
		return trial;
	}

	public void setTrial(boolean trial) {
		this.trial = trial;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((licenseType == null) ? 0 : licenseType.hashCode());
		result = prime * result + ((term == null) ? 0 : term.hashCode());
		result = prime * result + (trial ? 1231 : 1237);
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		License other = (License) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (licenseType != other.licenseType)
			return false;
		if (term == null) {
			if (other.term != null)
				return false;
		} else if (!term.equals(other.term))
			return false;
		if (trial != other.trial)
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "License [id=" + id + ", licenseType=" + licenseType + ", term=" + term + ", trial=" + trial + "]";
	}

}
