
<template>
  <div class="parsed-errors">
    <p
      class="margin-vertical-10px"
      v-for="(error, index) in standardErrors"
      :key="index"
    >
      <span
        class="text-red"
        v-if="!isDisableKeyMessage"
      >
        {{ error.key }}:
      </span>
      {{ error.message }}
    </p>

    <p
      class="margin-vertical-10px"
      v-for="(error, index) in graphqlErrors(requestErrors)"
      :key="index"
    >
      <span
        class="text-red"
        v-if="!isDisableKeyMessage"
      >
        {{ error.path[0] }}:
      </span>
      {{ error.message }}
    </p>
  </div>
</template>

<script>
/*
  eslint consistent-return: 0, array-callback-return: 0
*/

export default {
  name: 'GraphQLErrorParser',

  props: {
    standardErrors: {
      type: Array,
      validator(value) {
        value.map((elem) => {
          if (
            typeof elem.key !== 'string' ||
            typeof elem.message !== 'string'
          ) {
            return false;
          }
        });

        return true;
      },
      default: [],
    },

    requestErrors: {
      type: Error,
    },

    isDisableKeyMessage: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    graphqlErrors(requestErrors) {
      if (requestErrors) {
        const { graphQLErrors, networkError } =
          JSON.parse(JSON.stringify(requestErrors));

        if (graphQLErrors && graphQLErrors.length) {
          return graphQLErrors;
        }

        if (networkError) {
          const { result: { errors } } = networkError;

          return this.parseNetworkErrors(errors);
        }
      }

      return [];
    },

    parseNetworkErrors(errors) {
      return errors.reduce((acc, elem) => {
        acc.push({
          path: ['Request Param'],
          message: elem.message,
        });

        return acc;
      }, []);
    },
  },
};
</script>


<style scoped>
</style>
