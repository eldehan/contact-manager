import View from "./view.js";
import Model from "./model.js";
import debounce from "./debounce.js";

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.renderContacts();
  }

  async renderContacts(contacts) {
    if (!contacts) {
      contacts = await this.model.fetchContacts();
    }

    contacts = this.model.formatTagsLists(contacts);

    this.view.displayContacts(contacts);
    this.handleClearSearchBtn();
    this.handleClickTagsToFilter();
    this.handleBtnCreateContact();
    this.handleBtnsEditContact();
    this.handleBtnsDeleteContact();
    this.handleSearchInput();
  }

  handleClickTagsToFilter() {
    let contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(contactCard => {
      contactCard.addEventListener('click', async e => {
        if (e.target.classList.contains('tag')) {
          let selectedTag = e.target.innerText;
          let filteredContacts = await this.model.filterContactsByTag(selectedTag)
          this.renderContacts(filteredContacts);
          this.handleClearTagFilterBtn();
        }
      });
    });
  }

  handleClearTagFilterBtn() {
    let button = document.querySelector('.clear-tag-filter-btn');
    button.classList.toggle('hidden');
    button.addEventListener('click', e => {
      this.renderContacts();
    });
  }

  handleBtnCreateContact() {
    let createContactBtn = document.querySelector('.create-contact-btn');
    createContactBtn.addEventListener('click', e => {
      e.preventDefault();

      this.view.displayCreateContact();

      this.view.displayAddTagsBtn();
      this.view.displayTagsRemovable();
      this.handleAddTagsBtn();
      this.handleClickTagToRemove();

      this.handleBtnCancel();
      this.handleSubmitContactForm();
    });
  }

  handleBtnsEditContact() {
    let editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(button => {
      button.addEventListener('click', async e => {
        e.preventDefault();

        let contactId = +button.getAttribute('data-id');
        let contact = await this.model.fetchContact(contactId);
        contact = this.model.formatTags(contact);

        this.view.displayEditContact(contact);

        this.view.displayAddTagsBtn();
        this.view.displayTagsRemovable();
        this.handleAddTagsBtn();
        this.handleClickTagToRemove();

        this.handleBtnCancel();
        this.handleSubmitContactForm();
      });
    });
  }

  handleAddTagsBtn() {
    let addTagBtn = document.querySelector('.add-tag-btn');

    let newTagSubform = document.querySelector('.new-tag-subform');
    let submitBtn = newTagSubform.querySelector('.submit-tag');
    let newTagInput = newTagSubform.querySelector('.tag-text-input');

    let submitTagsEventHandler = e => {
      let newTag = newTagInput.value.trim();
      let tagErrorP = newTagSubform.querySelector('p');

      if (this.model.validateTag(newTag)) {
        this.view.alterText(tagErrorP, '');
        this.view.appendTagToList(newTag);
        this.view.toggleAddTagsInput();
      } else {

        this.view.alterText(tagErrorP, "New tags must be at least one character in length and contain only letters (a-z).")
      }
    };

    addTagBtn.addEventListener('click', e => {
      e.preventDefault();

      this.view.toggleAddTagsInput();
    });

    submitBtn.addEventListener('click', submitTagsEventHandler);
    newTagInput.addEventListener('keypress', e => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitTagsEventHandler();
      }
    });
  }

  handleClickTagToRemove() {
    let tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
      tag.addEventListener('click', e => {
        if (confirm('Do you want to remove this tag?')) {
          this.view.removeTagFromList(e.target);
        }
      });
    });
  }

  handleBtnsDeleteContact() {
    let deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();        
        
        if (confirm("Are you sure you want to delete this contact?")) {
          let id = +button.getAttribute("data-id");
          this.model.deleteContact(id);

          this.renderContacts();
        }
      });
    });
  }

  handleBtnCancel() {
    let cancelBtn = document.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', e => {
      e.preventDefault();
      this.renderContacts();
    });
  }

  handleSubmitContactForm() {
    let form = document.querySelector('.contact-form');
    form.addEventListener('submit', e => {
      e.preventDefault();

      if (this.validateForm()) {
        let formData = new FormData(form);
        let tags = [...document.querySelectorAll('.tag')]
                    .map(tagSpan => tagSpan.textContent)
                    .join(',');

        if (!tags) {
          tags = [];
        }

        formData.append('tags', tags);

        if (form.getAttribute('data-formType') === 'create') {
          this.model.createContact(formData);
        } else {
          let contactId = +form.getAttribute('data-id');
          this.model.updateContact(contactId, formData);
        }

        this.renderContacts();
      }

    });
  }

  handleSearchInput() {
    let searchbar = document.querySelector('#search-contacts');
    let searchFunc = (async e => {
      let input = searchbar.value;
      let searchString = searchbar.value;
      let filteredContacts = await this.model.filterContactsByName(searchString);
      this.renderContacts(filteredContacts);

      searchbar = document.querySelector('#search-contacts');
      searchbar.value = input;
    });

    let debouncedSearch = debounce(searchFunc, 1000);
    
    searchbar.addEventListener('input', debouncedSearch);
  }

  handleClearSearchBtn() {
    let clearSearchBtn = document.querySelector('.clear-search-btn');
    clearSearchBtn.addEventListener('click', e => {
      this.renderContacts();
    });
  }

  validateForm() {
    let nameInput = document.querySelector('#full-name');
    let emailInput = document.querySelector('#email');
    let phoneInput = document.querySelector('#phone-number');

    let errors = [];

    let validationErrorMessages = document.querySelectorAll('.validation');
    validationErrorMessages.forEach(message => message.style.display = 'none');
    if (!/^[a-z]+(\s[a-z]+)*$/i.test(nameInput.value)) errors.push(nameInput.id);
    if (!/^[a-z0-9.]+@[a-z0-9]+\.[a-z0-9]+$/i.test(emailInput.value)) errors.push(emailInput.id);
    if (!/(^[\d]{10}$)|(^[\d]{3}-[\d]{3}-[\d]{4}$)/.test(phoneInput.value)) errors.push(phoneInput.id);

    errors.forEach(error => {
      document.querySelector(`.${error}-validation`).style.display = 'inline';
    });

    return errors.length === 0;

  }
}

document.addEventListener('DOMContentLoaded', () => {
  const controller = new Controller(new Model(), new View());
});