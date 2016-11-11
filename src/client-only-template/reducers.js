import {combineReducers} from 'redux';
import {createEntityReducer} from 'redux-blueflag';
import EntitySchema from 'client-only-template/EntitySchema';
export default combineReducers({
    entity: createEntityReducer({
        mainSchema: EntitySchema,
        GRAPHQL_RECEIVE: EntitySchema
    }),
    testReducer: function(reducer) {
        return {
            foo: 'asdfsda'
        }
    }
});

