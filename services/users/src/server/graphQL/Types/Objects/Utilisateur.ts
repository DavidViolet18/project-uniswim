import { ObjectType, Field } from "typegql";

@ObjectType()
export default class Utilisateur {
    @Field()
    id: number

    @Field()
    login: string

    @Field()
    nom: string

    @Field()
    prenom: string

    @Field()
    email: string
}

