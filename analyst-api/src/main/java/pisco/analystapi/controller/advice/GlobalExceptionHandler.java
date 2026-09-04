package pisco.analystapi.controller.advice;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.core.PropertyReferenceException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import pisco.analystapi.exception.BadRequestException;
import pisco.analystapi.exception.ConflictException;
import pisco.analystapi.exception.NotFoundException;

/** Every error leaves as an RFC 9457 ProblemDetail, never as a stack trace or a bare 500. */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ProblemDetail handleNotFound(NotFoundException ex) {
        logger.error("Risorsa non trovata: " + ex.getMessage());
        return problem(HttpStatus.NOT_FOUND, "Risorsa non trovata", ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ProblemDetail handleBadRequest(BadRequestException ex) {
        logger.error("Richiesta non valida: " + ex.getMessage());
        return problem(HttpStatus.BAD_REQUEST, "Richiesta non valida", ex.getMessage());
    }

    /**
     * An orderBy naming a property the entity does not have. Spring Data raises this while
     * building the query, so without a handler an ordinary typo in a query string comes
     * back as a 500.
     */
    @ExceptionHandler(PropertyReferenceException.class)
    public ProblemDetail handleUnknownSortProperty(PropertyReferenceException ex) {
        logger.error("Ordinamento non valido: " + ex.getMessage());
        return problem(HttpStatus.BAD_REQUEST, "Ordinamento non valido",
                "Proprieta' inesistente per l'ordinamento: " + ex.getPropertyName());
    }

    @ExceptionHandler(ConflictException.class)
    public ProblemDetail handleConflict(ConflictException ex) {
        logger.error("Conflitto: " + ex.getMessage());
        return problem(HttpStatus.CONFLICT, "Conflitto", ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCredentials(BadCredentialsException ex) {
        // The log stays as vague as the response: without the address, it cannot become a
        // list of who has an account here.
        logger.error("Credenziali non valide");
        // Deliberately vague: never reveal whether it was the email or the password.
        return problem(HttpStatus.UNAUTHORIZED, "Credenziali non valide", "Email o password errate");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(AccessDeniedException ex) {
        logger.error("Accesso negato: " + ex.getMessage());
        return problem(HttpStatus.FORBIDDEN, "Accesso negato", "Permessi insufficienti");
    }

    /**
     * Last line of defence for a constraint the service layer did not check first -- a
     * race on a unique column, say. A duplicate should normally surface as a
     * ConflictException from the service, with a message that names the field.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrity(DataIntegrityViolationException ex) {
        logger.error("Violazione di integrita' non intercettata a livello di servizio", ex);
        return problem(HttpStatus.CONFLICT, "Conflitto", "Operazione in conflitto con i dati esistenti");
    }

    /**
     * Anything not matched above. Without it an unexpected exception escapes to the
     * container and comes back as a bare 500 with no ProblemDetail and no log line, which
     * is the one thing this class exists to prevent.
     *
     * <p>The handlers above are all more specific, so Spring keeps preferring them; this
     * only catches what genuinely has nowhere else to go. It is also the only handler that
     * logs the exception itself, since here the message is the sole record of what broke --
     * the client is told nothing beyond that something did.
     */
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpected(Exception ex) {
        logger.error("Errore imprevisto: " + ex.getMessage(), ex);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Errore interno",
                "Si e' verificato un errore imprevisto");
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));

        // Only the field names: the values are what would carry patient data.
        logger.error("Dati non validi, campi: " + errors.keySet());

        ProblemDetail body = problem(HttpStatus.BAD_REQUEST, "Dati non validi", "Alcuni campi non sono validi");
        body.setProperty("errors", errors);
        return ResponseEntity.badRequest().body(body);
    }

    private static ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setTitle(title);
        return problem;
    }
}
