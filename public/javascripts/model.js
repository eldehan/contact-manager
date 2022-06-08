class Model {
  constructor() {

  }

  async fetchContacts() {
    const response = await fetch('/api/contacts')
      .then(res => res.json())
      .catch(() => alert('An error occurred retrieving the contacts.'));

    return response;
  }

  async fetchContact(contactId) {
    const response = await fetch(`/api/contacts/${contactId}`)
      .then(res => res.json())
      .catch(() => alert('An error occurred retrieving the contacts.'));

      return response;
  }
  
  async createContact(contactData) {
    const response = await fetch('/api/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: this.formDataToJSON(contactData)
    });
  }

  async deleteContact(contactId) {
    await fetch(`/api/contacts/${contactId}`, {
      method: 'DELETE'
    });
  }

  async updateContact(contactId, contactData) {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: this.formDataToJSON(contactData)
    });
  }

  formDataToJSON(formData) {
    let object = {};
    formData.forEach((value, key) => object[key] = value);

    return JSON.stringify(object);
  }

  formatTagsLists(contacts) {
    return contacts.map(contact => this.formatTags(contact));
  }

  formatTags(contact) {
    if (contact.tags.length > 0) {
      contact.tags = contact.tags.split(',').map(tag => tag.trim());
    } else {
      contact.tags = [];
    }
    
    return contact;
  }

  validateTag(tag) {
    let validPattern = new RegExp(/^[a-zA-Z]+$/, 'i');
    return validPattern.test(tag);
  }

  async filterContactsByTag(tag) {
    let contacts = await this.fetchContacts();

    let filtered = contacts.filter(contact => {
      return contact.tags.split(',').includes(tag);
    });

    return filtered;
  }

  async filterContactsByName(searchString) {
    let searchRegExp = new RegExp(searchString, 'i')
    let contacts = await this.fetchContacts();

    let filtered = contacts.filter(contact => {
      return searchRegExp.test(contact['full_name']);
    });

    return filtered;
  }
}

export default Model;