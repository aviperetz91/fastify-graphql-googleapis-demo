import EventController from '../../controllers/event.controller';

const eventController = new EventController();

const eventResolvers = {
  Query: {
    events: async (_: any, __: any, context: { accessToken: string }) => {
      const events = await eventController.fetchEvents(context.accessToken);
      return events;
    },
  },
};

export default eventResolvers;
