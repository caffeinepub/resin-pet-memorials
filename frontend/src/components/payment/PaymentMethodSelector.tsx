import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentMethod } from '../../backend';
import { CreditCard, Wallet, Bitcoin } from 'lucide-react';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const paymentOptions = [
    {
      value: PaymentMethod.stripe,
      label: 'Credit/Debit Card',
      description: 'Pay securely with Stripe',
      icon: CreditCard,
    },
    {
      value: PaymentMethod.paypal,
      label: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: Wallet,
    },
    {
      value: PaymentMethod.crypto,
      label: 'Cryptocurrency',
      description: 'Pay with Bitcoin or other crypto',
      icon: Bitcoin,
    },
  ];

  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as PaymentMethod)}
      className="space-y-3"
    >
      {paymentOptions.map((option) => {
        const Icon = option.icon;
        return (
          <div
            key={option.value}
            className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
              value === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onChange(option.value)}
          >
            <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
            <div className="flex-1">
              <Label
                htmlFor={option.value}
                className="flex items-center gap-2 cursor-pointer font-medium"
              >
                <Icon className="h-5 w-5" />
                {option.label}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
}
