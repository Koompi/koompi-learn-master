<template>
  <div
    class="admin-all-users flex size-calc-spacing-include
    justify-center align-center relative"
  >
    <div
      v-if="loading"
      class="flex column-align justify-center align-center"
    >
      <MoveBlockLoader/>
      <p class="margin-vertical-10px">Loading all courses</p>
    </div>

    <BaseTable
      v-if="users"
      :data="users"
      :numberOfEntry="allUserCount"
      :numberOfEntryPerPage="numberOfEntryPerPage"
      :titleMapper="tableTitleMapper"
      :onPageIndexChange="onPageIndexChange"
      :dataActions="dataActions"
      :onSearchInput="onSearchInput"
      :reactiveDataMapper="userChanges"
      :loading="refetching"
    />

    <GraphQLErrorParser
      v-if="standardErrors || requestErrors"
      :stantardErrors="standardErrors"
      :requestErrors="requestErrors"
    />

    <BaseButton
      label="+ User"
      bgColor="bg-blue"
      textColor="text-white"
      className="absolute admin-all-users-add-user"
      :onClick="openAddUserModal"
    />
  </div>
</template>

<script>
/*
  eslint max-lines: 0
*/
import _ from 'lodash';
import {
  BaseTable,
  MoveBlockLoader,
  GraphQLErrorParser,
  BaseButton,
  BaseForm,
} from '@/components';
import { ADMIN_ALL_USERS_QUERY, ADMIN_ALL_USER_COUNT } from '@/queries';
import { UPDATE_ROLE_MUTATION, ADMIN_ADD_USER_MUTATION } from '@/mutations';

export default {
  name: 'AdminAllUsers',

  components: { BaseTable, MoveBlockLoader, GraphQLErrorParser, BaseButton },

  watch: {
    pageOffset() { this.refetching = true; },

    usernameSearch() { this.refetching = true; },

    orderByDate() { this.refetching = true; },

    orderByActive() { this.refetching = true; },
  },

  data() {
    return {
      loading: true,
      refetching: false,

      users: null,
      allUserCount: 0,
      numberOfEntryPerPage: 10,
      pageOffset: 0,
      usernameSearch: '',

      userChanges: {},

      orderByDate: false,
      orderByActive: false,

      standardErrors: null,
      requestErrors: null,
    };
  },

  apollo: {
    listUsers: {
      query: ADMIN_ALL_USERS_QUERY,
      thorttle: 2000,
      debounce: 2000,
      variables() {
        return {
          limit: this.numberOfEntryPerPage,
          offset: this.pageOffset,
          username: this.usernameSearch,
          orderByDate: this.orderByDate,
          orderByActive: this.orderByActive,
        };
      },
      result({ data, networkStatus }) {
        if (networkStatus === 8) {
          this.standardErrors = [{ key: 'network', message: 'unresolved' }];
        }

        if (data.listUsers) {
          this.users = data.listUsers;
        }

        this.loading = false;
        this.refetching = false;
      },
    },

    allUserCount: {
      query: ADMIN_ALL_USER_COUNT,
      throttle: 2000,
      debounce: 2000,
    },
  },

  computed: {
    tableTitleMapper() {
      return [{
        fieldName: 'username',
        fieldNameRemap: 'Username',
        customFieldTransform: null,
        sortable: false,
      }, {
        fieldName: 'email',
        fieldNameRemap: 'Email',
        customFieldTransform: null,
        sortable: false,
      }, {
        fieldName: 'insertedAt',
        fieldNameRemap: 'Created At',
        customFieldTransform: null,
        sortable: true,
        onSortBy: this.onSortByDate,
        isSorted: this.orderByDate,
      }, {
        fieldName: 'active',
        fieldNameRemap: 'Account Active',
        customFieldTransform: null,
        sortable: true,
        onSortBy: this.onSortByActive,
        isSorted: this.orderByActive,
      }, {
        fieldName: 'roles',
        fieldNameRemap: 'Roles',
        customFieldTransform: (dataField, reactiveMapper, data) => {
          let str = '';

          if (reactiveMapper[data.id]) {
            reactiveMapper[data.id].map((field) => {
              str += `${field}, `;

              return field;
            });

            return str;
          }

          dataField.map((field) => {
            str += `${field.title}, `;

            return field;
          });

          return str;
        },
        sortable: false,
      }];
    },

    dataActions() {
      return [{
        element: BaseButton,
        elementProps: {
          label: 'Edit',
          bgColor: 'bg-red',
          textColor: 'text-white',
        },
        callback: this.openEditUserModal,
      }];
    },
  },

  methods: {
    onSortBy(property) {
      switch (property) {
        case 'date': {
          this.orderByDate = !this.orderByDate;

          break;
        }

        case 'active': {
          this.orderByActive = !this.orderByActive;

          break;
        }

        default: break;
      }
    },

    onSortByDate() { this.onSortBy('date'); },

    onSortByActive() { this.onSortBy('active'); },

    onPageIndexChange: _.debounce(function (index) {
      if (!this.refetching) {
        this.pageOffset = index * this.numberOfEntryPerPage;
      }
    }, 1000),

    onSearchInput(value) {
      if (!this.refetching) {
        this.usernameSearch = value;
      }
    },

    openEditUserModal(user) {
      this.openModal({
        contentComponent: BaseForm,
        contentProps: {
          formFields: [{
            label: 'Roles',
            type: 'tag',
            name: 'roles',
            options: [
              { title: 'admin' },
              { title: 'student' },
              { title: 'instructor' },
            ],
            values: user.roles,
            contentProps: { labelProperty: 'title' },
            uniqueId: 'userRoles',
          }],
          submitButtonLabel: 'Save',
          isVerticalStyling: true,
          isShowErrorOnInput: true,
          isShowTitleLineBreak: false,
          onSubmit: values => this.saveUserRoleEdit(values, user.id),
        },
      });
    },

    openAddUserModal() {
      this.openModal({
        contentComponent: BaseForm,
        contentProps: {
          formFields: [{
            type: 'text',
            label: 'Username',
            name: 'username',
          }, {
            type: 'email',
            label: 'Email',
            name: 'email',
          }, {
            type: 'password',
            label: 'Password',
            name: 'password',
          }, {
            type: 'tag',
            label: 'Roles',
            name: 'roles',
            options: [{
              title: 'admin',
            }, {
              title: 'student',
            }, {
              title: 'instructor',
            }],
            contentProps: { labelProperty: 'title' },
            uniqueId: 'newUserRoles',
          }],
          submitButtonLabel: 'Save',
          isVerticalStyling: true,
          isNoSubmitOnEnter: true,
          isShowErrorOnInput: true,
          isShowTitleLineBreak: false,
          onSubmit: this.saveNewUser,
        },
      });
    },

    async saveNewUser(values) {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: ADMIN_ADD_USER_MUTATION,
          throttle: 2000,
          debounce: 2000,
          variables: values,
        });

        if (data.addUser) {
          if (data.addUser.ok) {
            this.$toasted.success('Successfully added new user', {
              duration: 3000,
              singleton: true,
            });
          } else if (data.addUser.errors) {
            console.log(data.addUser.errors);
          }
        }
      } catch (errors) {
        console.log(errors);
      }
    },

    async saveUserRoleEdit({ roles }, userId) {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: UPDATE_ROLE_MUTATION,
          throttle: 2000,
          debounce: 2000,
          variables: { roles, userId },
        });

        if (data.updateRole) {
          if (data.updateRole.ok) {
            this.userChanges = { ...this.userChanges, [userId]: roles };

            this.$toasted.success('Successfully updated user role', {
              duration: 3000,
              singleton: true,
            });
          } else if (data.updateRole.errors) {
            console.log(data.updateRole.errors);
          }
        }
      } catch (errors) {
        console.log(errors);
      }
    },

    openModal({ contentComponent, contentProps }) {
      this.$store.commit('openModal', {
        contentComponent,
        contentProps,
        closeOnOutsideClick: true,
        clearModalContentOnInit: true,
      });
    },
  },
};
</script>

<style scoped>
.admin-all-users {padding: 10px;}
.admin-all-users-add-user {bottom: 0px; left: 10px;}
</style>
