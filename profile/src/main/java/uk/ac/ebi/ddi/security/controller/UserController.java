package uk.ac.ebi.ddi.security.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import uk.ac.ebi.ddi.security.model.MongoUser;
import uk.ac.ebi.ddi.security.model.User;
import uk.ac.ebi.ddi.security.model.UserAuthentication;
import uk.ac.ebi.ddi.security.repo.MongoUserDetailsRepository;

@RestController
public class UserController {

	@Autowired
	MongoUserDetailsRepository mongoUserDetailsRepository;

	@RequestMapping(value = "/api/user/current", method = RequestMethod.GET)
	@CrossOrigin
	public User getCurrent() {
		final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication instanceof UserAuthentication) {
			return ((UserAuthentication) authentication).getDetails();
		}
		return new User(); //anonymous user support
	}

	@RequestMapping(value = "/api/mongo", method = RequestMethod.GET)
	@CrossOrigin
	public MongoUser getMongoUser() {
		return mongoUserDetailsRepository.findByUserId("0");
	}

	@RequestMapping(value = "/api/mongo", method = RequestMethod.POST)
	@CrossOrigin
	public void setMongoUser(@RequestBody MongoUser mongoUser) {
		mongoUserDetailsRepository.save(mongoUser);
	}

}