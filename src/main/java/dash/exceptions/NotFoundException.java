package dash.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class NotFoundException extends Exception {

	private static final long serialVersionUID = 5520905786207281118L;

	public NotFoundException(String message) {
		super(message);
	}
}
