import ContactController from '../../controllers/contact.controller';

const contactController = new ContactController();

const contactResolvers = {
  Query: {
    contacts: async (_: any, __: any, context: { accessToken: string }) => {
      const contacts = await contactController.fetchContacts(context.accessToken);
      return contacts;
    },
  },
};

export default contactResolvers;
