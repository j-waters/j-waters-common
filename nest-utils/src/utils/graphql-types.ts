import { Type } from '@nestjs/common';
import { isFunction } from '@nestjs/common/utils/shared.utils';
import {
    inheritPropertyInitializers,
    inheritTransformationMetadata,
    inheritValidationMetadata,
} from '@nestjs/mapped-types';
import { ClassDecoratorFactory } from '@nestjs/graphql/dist/interfaces/class-decorator-factory.interface';
import { getFieldsAndDecoratorForType } from '@nestjs/graphql/dist/schema-builder/utils/get-fields-and-decorator.util';
import { applyFieldDecorators } from '@nestjs/graphql/dist/type-helpers/type-helpers.utils';
import { Field } from '@nestjs/graphql';

export function changeDecorator<T>(
    classRef: Type<T>,
    decorator?: ClassDecoratorFactory,
): Type<T> {
    const { fields, decoratorFactory } = getFieldsAndDecoratorForType(classRef);

    abstract class ChangeObjectType {
        constructor() {
            inheritPropertyInitializers(this, classRef, () => true);
        }
    }

    decoratorFactory({ isAbstract: true })(ChangeObjectType);
    if (decorator) {
        decorator({ isAbstract: true })(ChangeObjectType);
    } else {
        decoratorFactory({ isAbstract: true })(ChangeObjectType);
    }

    inheritValidationMetadata(classRef, ChangeObjectType, () => true);
    inheritTransformationMetadata(classRef, ChangeObjectType, () => true);

    fields.forEach((item) => {
        if (isFunction(item.typeFn)) {
            /**
             * Execute type function eagarly to update the type options object (before "clone" operation)
             * when the passed function (e.g., @Field(() => Type)) lazily returns an array.
             */
            item.typeFn();
        }

        Field(item.typeFn, { ...item.options })(
            ChangeObjectType.prototype,
            item.name,
        );
        applyFieldDecorators(ChangeObjectType, item);
    });
    return ChangeObjectType as Type<T>;
}
