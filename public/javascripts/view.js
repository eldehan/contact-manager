class View {
  constructor() {
    Handlebars.registerHelper('createContact', function (pageType) {
      return pageType === 'create';
    });
    
    this.contentContainer = document.querySelector('.content-container');

    this.mainPageScript = document.querySelector('#main-page-template');
    this.mainPageTemplate = Handlebars.compile(this.mainPageScript.innerHTML);
    Handlebars.registerPartial('contact-card-template', document.querySelector('#contact-card-template').innerHTML)
    
    this.contactsListScript = document.querySelector('#contacts-list-template');
    this.contactsListTemplate = Handlebars.compile(this.contactsListScript.innerHTML);
    // Handlebars.registerPartial('contacts-list-template', document.querySelector('#contacts-list-template').innerHTML);

    this.createContactScript = document.querySelector('#create-contact-page-template');
    this.createContactTemplate = Handlebars.compile(this.createContactScript.innerHTML);
    
    this.editContactScript = document.querySelector('#edit-contact-page-template');
    this.editContactTemplate = Handlebars.compile(this.editContactScript.innerHTML);

    Handlebars.registerPartial('contact-form-template', document.querySelector('#contact-form-template').innerHTML)
  
    Handlebars.registerPartial('contact-tags-partial', document.querySelector('#contact-tags-partial').innerHTML);
  }

  displayContacts(contacts) {
    this.contentContainer.innerHTML = this.mainPageTemplate();
    this.contactsContainer = document.querySelector('.contacts-container');
    this.contactsContainer.innerHTML = this.contactsListTemplate({ contacts });
  }

  displayCreateContact() {
    this.main = document.querySelector('main');
    this.main.innerHTML = this.createContactTemplate();
  }

  displayEditContact(contact) {
    this.main = document.querySelector('main');
    this.main.innerHTML = this.editContactTemplate(contact);
  }

  displayAddTagsBtn() {
    let editTagsBtn = document.querySelector('.add-tag-btn');

    editTagsBtn.classList.toggle('hidden');
  }

  displayTagsRemovable() {
    let tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
      tag.classList.add('tag-removable');
    });
  }

  toggleAddTagsInput() {
    let editTagBtn = document.querySelector('.add-tag-btn');

    let newTagSubform = document.querySelector('.new-tag-subform');

    editTagBtn.classList.toggle('hidden');
    newTagSubform.classList.toggle('hidden');
  }

  appendTagToList(tag) {
    let tagList = document.querySelector('.tags-list');
    
    let newTagSpan = document.createElement('span');
    newTagSpan.classList.add('tag');
    newTagSpan.textContent = tag;
    tagList.append(newTagSpan);
  }

  removeTagFromList(tag) {
    tag.parentElement.removeChild(tag);
  }

  alterText(element, message) {
    element.innerText = message;
  }
}

export default View;