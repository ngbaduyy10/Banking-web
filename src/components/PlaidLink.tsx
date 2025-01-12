import {Button} from "@/components/ui/button";
import {useEffect, useState, useCallback} from "react";
import {createLinkToken} from "@/lib/actions/user.action";
import {usePlaidLink, PlaidLinkOptions, PlaidLinkOnSuccess} from "react-plaid-link";
import {exchangePublicToken} from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";

const PlaidLink = ({ user } : PlaidLinkProps) => {
    const router = useRouter();
    const [token, setToken] = useState(null);

    useEffect(() => {
        const getLinkToken = async () => {
            const response = await createLinkToken(user);
            setToken(response?.linkToken);
        }

        getLinkToken();
    }, [user])

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        await exchangePublicToken({
            publicToken: public_token,
            user,
        })

        router.push('/');
    }, [user, router])

    const config: PlaidLinkOptions = { token, onSuccess }

    const { open, ready } = usePlaidLink(config);

    return (
        <Button
            className="plaidlink-primary"
            onClick={() => open()}
            disabled={!ready}
        >
            Connect Bank
        </Button>
    )
}

export default PlaidLink;