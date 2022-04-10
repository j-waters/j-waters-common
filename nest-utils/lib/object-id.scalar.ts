import { ObjectId } from 'mongodb';
import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('ObjectId', (type) => ObjectId)
export class ObjectIdScalar implements CustomScalar<string, ObjectId> {
    description = 'ObjectId custom scalar type';

    parseValue(value: unknown): ObjectId {
        if (typeof value !== 'string') {
            throw new Error('ObjectIdScalar can only parse string values');
        }
        return new ObjectId(value);
    }

    serialize(value: unknown): string {
        if (!(value instanceof ObjectId)) {
            throw new Error('ObjectIdScalar can only serialize ObjectId values');
        }
        return value.toHexString();
    }

    parseLiteral(ast: ValueNode): ObjectId {
        if (ast.kind !== Kind.STRING) {
            throw new Error('ObjectIdScalar can only parse string values');
        }
        return new ObjectId(ast.value);
    }
}
